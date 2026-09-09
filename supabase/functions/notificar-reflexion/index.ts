/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const FCM_V1_URL = "https://fcm.googleapis.com/v1/projects/cesar-36085/messages:send";

function cleanText(value: unknown, maxLen = 240): string {
  if (!value) return "";
  return String(value)
    .replace(/[*_`#>~]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-publish-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function base64url(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(serviceAccountJson: string): Promise<string> {
  const sa = JSON.parse(serviceAccountJson);
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64url(
    new TextEncoder().encode(JSON.stringify(header))
  );
  const encodedPayload = base64url(
    new TextEncoder().encode(JSON.stringify(payload))
  );
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const pkcs8Pem = sa.private_key;
  const pemBody = pkcs8Pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");

  const binaryDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    new TextEncoder().encode(signingInput)
  );

  const assertion = `${signingInput}.${base64url(new Uint8Array(signature))}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }).toString(),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(`Error obteniendo access token: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

async function sendToOneToken(
  accessToken: string,
  token: string,
  title: string,
  bodyText: string,
  refText: string,
  reflexionId: string | null
): Promise<{ ok: boolean; status: number; body: string }> {
  const fcmPayload = {
    message: {
      token,
      android: {
        priority: "high",
        notification: {
          title,
          body: bodyText,
          channel_id: "reflexiones",
          icon: "ic_stat_icon_config_sample",
          color: "#c8a97e",
          sound: "default",
        },
      },
      notification: {
        title,
        body: bodyText,
      },
      data: {
        reflexionId: reflexionId || "",
        titulo: title,
        referencia: refText,
        click_action: "OPEN_REFLEXION",
      },
    },
  };

  const fcmRes = await fetch(FCM_V1_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fcmPayload),
  });

  const fcmBody = await fcmRes.text();
  return { ok: fcmRes.ok, status: fcmRes.status, body: fcmBody };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Método no permitido" }, 405);
    }

    const publishSecret = Deno.env.get("PUBLISH_SECRET");
    const providedSecret = req.headers.get("x-publish-secret");
    if (!publishSecret || providedSecret !== publishSecret) {
      return json({ error: "Secreto de publicación inválido" }, 401);
    }

    const serviceAccountJson = Deno.env.get("FIREBASE_SERVICE_ACCOUNT");
    if (!serviceAccountJson) {
      return json(
        {
          error:
            "FIREBASE_SERVICE_ACCOUNT no configurado en Supabase.",
        },
        500
      );
    }

    const { titulo, referencia, contenido, reflexionId, token } = await req.json();
    const title = cleanText(titulo, 60) || "Centro Cristiano Mision Global Colon";
    const refText = cleanText(referencia, 80);
    const contentText = cleanText(contenido, 160);
    let bodyText = "Nueva reflexión para ti";
    if (refText) {
      bodyText = refText;
      if (contentText) {
        bodyText = `${refText} — ${contentText}`;
      }
    } else if (contentText) {
      bodyText = contentText;
    }
    bodyText = bodyText.slice(0, 240);

    const accessToken = await getAccessToken(serviceAccountJson);

    // Si se envió un token específico, enviar solo a ese dispositivo
    if (token) {
      const result = await sendToOneToken(accessToken, token, title, bodyText, refText, reflexionId);
      if (!result.ok) {
        console.error("FCM v1 error:", result.status, result.body);
        return json({ error: "Error enviando notificación", details: result.body }, result.status);
      }
      return json({ success: true, sent: 1, response: result.body });
    }

    // Sin token específico: buscar todos los tokens registrados en Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseKey) {
      const tokensRes = await fetch(
        `${supabaseUrl}/rest/v1/fcm_tokens?select=device_id,token`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );

      if (tokensRes.ok) {
        const rows = await tokensRes.json();
        const tokens: { device_id: string; token: string }[] = rows || [];

        if (tokens.length === 0) {
          return json({
            success: true,
            sent: 0,
            message: "No hay dispositivos registrados. Abre la app para registrarse.",
          });
        }

        let sent = 0;
        const invalidTokens: string[] = [];

        for (const row of tokens) {
          const result = await sendToOneToken(
            accessToken,
            row.token,
            title,
            bodyText,
            refText,
            reflexionId
          );
          if (result.ok) {
            sent++;
          } else {
            const err = result.body;
            if (err.includes("UNREGISTERED") || err.includes("INVALID_ARGUMENT")) {
              invalidTokens.push(row.token);
            }
            console.error(`FCM error para ${row.device_id}:`, result.status, err.slice(0, 200));
          }
        }

        // Limpiar tokens inválidos
        if (invalidTokens.length > 0) {
          await fetch(
            `${supabaseUrl}/rest/v1/fcm_tokens?token=in.(${invalidTokens.map((t) => `"${t}"`).join(",")})`,
            {
              method: "DELETE",
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
              },
            }
          );
        }

        return json({
          success: true,
          sent,
          total: tokens.length,
          invalidCleaned: invalidTokens.length,
        });
      }
    }

    // Fallback: enviar al topic si no hay tokens en la BD
    const fcmPayload = {
      message: {
        topic: "reflexiones",
        android: {
          priority: "high",
          notification: {
            title,
            body: bodyText,
            channel_id: "reflexiones",
            icon: "ic_stat_icon_config_sample",
            color: "#c8a97e",
          },
        },
        notification: { title, body: bodyText },
        data: {
          reflexionId: reflexionId || "",
          titulo: title,
          referencia: refText,
          click_action: "OPEN_REFLEXION",
        },
      },
    };

    const fcmRes = await fetch(FCM_V1_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fcmPayload),
    });

    const fcmBody = await fcmRes.text();
    if (!fcmRes.ok) {
      console.error("FCM v1 topic error:", fcmRes.status, fcmBody);
      return json({ error: "Error enviando notificación", details: fcmBody }, fcmRes.status);
    }

    return json({ success: true, sent: "topic", response: fcmBody });
  } catch (e) {
    console.error("Error en notificar-reflexion:", e);
    return json({ error: e.message }, 500);
  }
});
