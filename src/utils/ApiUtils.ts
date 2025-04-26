import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";
import CommonUtils from "./CommonUtils";

type RequestMethodTypes = "GET" | "POST" | "PUT" | "DELETE" | (string & {});

interface RequestOption {
  params?: object;
  data?: object;
  useCache?: boolean;
  headers?: object;
}

interface RequestResult {
  result: boolean;
  statusCode: number;
  data: object;
}

export default class ApiUtils {
  // Request
  static async request(url: string, method: RequestMethodTypes, options: RequestOption = {}): Promise<RequestResult> {
    const { params = undefined, data = undefined, useCache = false, headers = {} } = options;
    let bResult: boolean = false;
    let statusCode: number = 200;
    let resultData: object = {};

    let requestUrl = url;
    let requestData = null;

    let apiUrl: string = process.env.NEXT_PUBLIC_API_URL;
    if (CommonUtils.isStringNullOrEmpty(apiUrl)) {
      apiUrl = "";
    }

    if (params) {
      const queryString = new URLSearchParams(params).toString();
      requestUrl = `${url}?${queryString}`;
    }
    if (data) {
      requestData = JSON.stringify(data);
    }

    let requestInit: RequestInit = {
      method: method,
      body: requestData,
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
        ...headers,
      },
    };
    if (!useCache) {
      requestInit["cache"] = "no-store";
    }

    await fetch(apiUrl + requestUrl, requestInit)
      .then(async (response) => {
        // 결과
        statusCode = response.status;
        if (statusCode >= 200 && statusCode < 300) {
          bResult = true;
        }
        resultData = await response.json();
      })
      .catch((error) => {
        console.log(error, apiUrl + requestUrl);

        resultData = "Api Error";
      });

    if (process.env.NEXT_PUBLIC_IS_DEBUG == "1" && resultData === "Api Error") {
      await fetch("http://192.168.0.69:3000" + requestUrl, requestInit).then(async (response) => {
        // 결과
        statusCode = response.status;
        if (statusCode >= 200 && statusCode < 300) {
          bResult = true;
        }
        resultData = await response.json();
      });
    }

    return { result: bResult, statusCode: statusCode, data: resultData };
  }
  static async fileUpload(file: File): Promise<RequestResult> {
    let bResult: boolean = false;
    let statusCode: number = 200;

    let resultData: object = {};

    const formData = new FormData();
    formData.append("files", file, file.name);

    await fetch("/api/files/upload_file", {
      method: "POST",
      body: formData,
      headers: {
        credentials: "include",
      },
    })
      .then(async (response) => {
        // 결과
        statusCode = response.status;
        if (statusCode >= 200 && statusCode < 300) {
          bResult = true;
        }
        resultData = await response.json();
      })
      .catch((error) => {
        console.log(error);
        resultData = "에러";
      });

    return { result: bResult, statusCode: statusCode, data: resultData };
  }

  // Response
  static parseData(data: any = {}) {
    if (typeof data === "string" || typeof data === "number") {
      data = { message: data };
    } else if (typeof data === "object") {
      data = data;
    } else if (typeof data === "boolean") {
      data = data;
    } else {
      data = {};
    }

    return data;
  }
  static response(data: any = {}) {
    let response: NextResponse = NextResponse.json(this.parseData(data), {
      status: 200,
    });

    return response;
  }
  static badRequest(data: any = {}, status: number = 400) {
    return NextResponse.json(this.parseData(data), { status: 400 });
  }
  static notAuth(data: any = {}) {
    return this.badRequest(data, 401);
  }
  static notFound(data: any = {}) {
    return this.badRequest(data, 404);
  }
  static serverError(data: any = {}) {
    return this.badRequest(data, 500);
  }

  static mediaUrl(_url) {
    if (!CommonUtils.isStringNullOrEmpty(_url)) {
      return "https://kr.cafe24obs.com/" + _url;
    }

    return "";
  }
}
