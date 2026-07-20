import * as http from "http";

export interface DebugClientState {
  componentTree: any[];
  properties: Record<string, Record<string, any>>;
  signalGraph: any;
  threadInfo: any;
  debuggerState: any;
}

export class DebugClient {
  private _host: string;
  private _port: number;
  private _eventSource: any = null;
  private _onMessage: ((type: string, data: any) => void) | null = null;

  constructor(host: string = "localhost", port: number = 9229) {
    this._host = host;
    this._port = port;
  }

  set onMessage(cb: (type: string, data: any) => void) {
    this._onMessage = cb;
  }

  async getState(): Promise<DebugClientState | null> {
    try {
      const body = await this._fetch("GET", "/state");
      return JSON.parse(body);
    } catch {
      return null;
    }
  }

  async setProperty(objectId: number, property: string, value: unknown): Promise<boolean> {
    try {
      const body = await this._fetch("POST", "/property", JSON.stringify({ objectId, property, value }));
      const result = JSON.parse(body);
      return result.ok === true;
    } catch {
      return false;
    }
  }

  async debuggerAction(action: string, body?: Record<string, unknown>): Promise<any> {
    try {
      const method = (action.startsWith("breakpoint/") || action === "eval") ? "POST" : "GET";
      const data = method === "POST" ? JSON.stringify(body || {}) : undefined;
      const response = await this._fetch(method, `/debugger/${action}`, data);
      return JSON.parse(response);
    } catch {
      return null;
    }
  }

  connectSSE(): void {
    this.disconnectSSE();
    const options = {
      hostname: this._host,
      port: this._port,
      path: "/events",
      method: "GET",
      headers: { Accept: "text/event-stream" },
    };

    const req = http.request(options, (res) => {
      let buffer = "";
      res.on("data", (chunk: Buffer) => {
        buffer += chunk.toString();
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";
        for (const part of parts) {
          const dataLine = part.split("\n").find((l: string) => l.startsWith("data: "));
          if (dataLine) {
            try {
              const msg = JSON.parse(dataLine.slice(6));
              this._onMessage?.(msg.type, msg.data);
            } catch {}
          }
        }
      });
      res.on("end", () => {
        this._onMessage?.("disconnected", null);
      });
    });

    req.on("error", () => {
      this._onMessage?.("error", null);
    });

    req.end();
    this._eventSource = req;
  }

  disconnectSSE(): void {
    if (this._eventSource) {
      this._eventSource.destroy();
      this._eventSource = null;
    }
  }

  private _fetch(method: string, path: string, body?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this._host,
        port: this._port,
        path,
        method,
        headers: body ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } : {},
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      });

      req.on("error", reject);
      if (body) req.write(body);
      req.end();
    });
  }
}
