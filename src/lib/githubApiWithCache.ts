import fs from "fs";
import * as crypto from "crypto";
import { GithubApi } from "./githubApi";

interface CacheFormat {
  ttl: number;
  data: Partial<Response> & { bodyText: string };
}

export class GithubApiWithCache extends GithubApi {
  constructor(
    apiUrl: string,
    protected cachePath: string,
    protected ttl: number
  ) {
    super(apiUrl);
    if (!fs.existsSync(cachePath)) {
      fs.mkdirSync(cachePath);
    }
  }

  updateTTL(milisec: number) {
    this.ttl = milisec;
  }

  protected override async _processRequest(path: string): Promise<Response> {
    const cache = this._loadCache(path);
    if (cache) return cache;

    const response = await super._processRequest(path);
    if (response.ok) {
      await this._saveCache(path, response.clone());
    }
    return response;
  }

  protected _hash(value: string): string {
    return crypto.createHash("sha256").update(value).digest("hex");
  }
  protected _loadCache(key: string): Response | null {
    const fileName = this._hash(key);
    const path = `${this.cachePath}/${fileName}`;
    if (!fs.existsSync(path)) return null;
    try {
      const result = fs.readFileSync(path).toString();
      const parsed = JSON.parse(result) as CacheFormat;
      if (parsed.ttl > Date.now()) {
        return {
          status: parsed.data.status,
          ok: parsed.data.ok,
          json: async () => Promise.resolve(JSON.parse(parsed.data.bodyText)),
        } as Response;
      } else {
        fs.unlinkSync(path);
        return null;
      }
    } catch {
      console.log(`Cache read failure`);
      return null;
    }
  }
  protected async _saveCache(key: string, data: Response): Promise<boolean> {
    const fileName = this._hash(key);
    try {
      fs.writeFileSync(
        `${this.cachePath}/${fileName}`,
        JSON.stringify({
          ttl: Date.now() + this.ttl,
          data: {
            status: data.status,
            ok: data.ok,
            bodyText: await data.text(),
          },
        } as CacheFormat)
      );
      return true;
    } catch {
      console.log(`Cache write failure`);
      return false;
    }
  }
}
