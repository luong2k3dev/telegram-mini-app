import { useEffect, useState } from "react";
import { TelegramWebApps } from "telegram-webapps-types";
import WebApp from "@twa-dev/sdk";
import crypto from "crypto";
/**
 * Hook to get the initial data from the Telegram Web Apps API already parsed.
 * @example
 * const { hash } = useTelegramInitData();
 * console.log({ hash });
 */
const verifyTelegramWebAppData = (telegramInitData: string) => {
  const botToken = "7404494799:AAGIyZaynaelpZd5_9gBOctvg3dCcEzBZVk";
  // The data is a query string, which is composed of a series of field-value pairs.
  const encoded = decodeURIComponent(telegramInitData);

  // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken);

  // Data-check-string is a chain of all received fields'.
  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];

  // Check expiration time
  const authDateIndex = arr.findIndex((str) => str.startsWith("auth_date="));
  const authDate = parseInt(arr.splice(authDateIndex, 1)[0].split("=")[1]);
  const currentTime = Math.floor(Date.now() / 1000);
  const timeDiff = currentTime - authDate;
  const maxTimeDiff = 300;

  // Sorted alphabetically
  arr.sort((a, b) => a.localeCompare(b));
  // In the format key=<value> with a line feed character ('\n', 0x0A) used as separator
  // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  const dataCheckString = arr.join("\n");

  // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
  const _hash = crypto
    .createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");

  // If hash is equal, the data may be used on your server.
  // Complex data types are represented as JSON-serialized objects.
  return _hash === hash && timeDiff < maxTimeDiff;
};

export function useTelegramInitData() {
  const [data, setData] = useState<TelegramWebApps.WebAppInitData>({});

  useEffect(() => {
    const firstLayerInitData = Object.fromEntries(
      new URLSearchParams(WebApp.initData)
    );

    const initData: Record<string, string> = {};

    for (const key in firstLayerInitData) {
      try {
        initData[key] = JSON.parse(firstLayerInitData[key]);
      } catch {
        initData[key] = firstLayerInitData[key];
      }
    }

    const validData = verifyTelegramWebAppData("query_id=AAE5iqA5AgAAADmKoDldrAZ8&user=%7B%22id%22%3A5261789753%2C%22first_name%22%3A%22BD%22%2C%22last_name%22%3A%22On%20Ton%22%2C%22username%22%3A%22Naiha86%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1719823065&hash=967268e8091665e30a395f01aec7c00ecfa50547b4be8d6b839348bbf295950c");
    initData['validData'] = validData.toString();
    initData['initData'] = WebApp.initData;

    setData(initData);
  }, []);

  return data;
}
