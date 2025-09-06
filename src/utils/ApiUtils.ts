import { filter, fromEntries, map, pipe } from '@fxts/core';
import type { RequestInit } from 'next/dist/server/web/spec-extension/request';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { NextResponse } from 'next/server';

type RequestMethodTypes = 'GET' | 'POST' | 'PUT' | 'DELETE' | (string & {});

interface RequestOption {
  params?: object;
  data?: object;
  cache?: RequestInit['cache'];
  headers?: object;
}

interface RequestResult {
  result: boolean;
  statusCode: number;
  data: any;
}

namespace ApiUtils {
  // Request
  export async function request(
    url: string,
    method: RequestMethodTypes,
    options: RequestOption = {},
    next?: RequestInit['next'],
  ): Promise<RequestResult> {
    if (!url) {
      return { result: false, statusCode: 400, data: {} };
    }

    const { params = undefined, data = undefined, cache, headers = {} } = options;
    let bResult = false;
    const statusCode = 200;
    let resultData: any = {};

    let requestUrl = url;
    let requestData = null;

    if (typeof window === 'undefined') {
      // SSR
      requestUrl = new URL(url, process.env.NEXT_PUBLIC_API_URL ?? '').toString();
    } else {
      // CSR
    }

    if (params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      requestUrl = `${requestUrl}?${queryString}`;
    }
    if (data) {
      requestData = JSON.stringify(data);
    }

    const requestInit: RequestInit = {
      method: method,
      body: requestData,
      headers: {
        'Content-Type': 'application/json',
        credentials: 'include',
        ...headers,
      },
      cache: cache,
    };
    if (next) {
      requestInit.next = next;
    }

    const response = await fetch(requestUrl, requestInit);
    if (response.status >= 200 && response.status < 300) {
      bResult = true;
    }

    resultData = await response.json();

    return { result: bResult, statusCode: statusCode, data: resultData };
  }
  export async function fileUpload(file: File): Promise<RequestResult> {
    let bResult = false;
    let statusCode = 200;

    let resultData: any = {};

    const formData = new FormData();
    formData.append('files', file, file.name);

    await fetch('/api/files/upload_file', {
      method: 'POST',
      body: formData,
      headers: {
        credentials: 'include',
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
        resultData = '에러';
      });

    return { result: bResult, statusCode: statusCode, data: resultData };
  }

  // Response
  export function parseData(data: any = {}) {
    if (typeof data === 'string' || typeof data === 'number') {
      return { message: data };
    } else if (typeof data === 'object') {
      return data;
    } else if (typeof data === 'boolean') {
      return data;
    } else {
      return {};
    }
  }
  export function response(data: any = {}) {
    const response: NextResponse = NextResponse.json(ApiUtils.parseData(data), {
      status: 200,
    });

    return response;
  }
  export function badRequest(data: any = {}, status = 400) {
    return NextResponse.json(ApiUtils.parseData(data), { status: 400 });
  }
  export function notAuth(data: any = {}) {
    return ApiUtils.badRequest(data, 401);
  }
  export function notFound(data: any = {}) {
    return ApiUtils.badRequest(data, 404);
  }
  export function serverError(data: any = {}) {
    return ApiUtils.badRequest(data, 500);
  }

  export function mediaUrl(_url: string) {
    if (_url) {
      return `https://kr.cafe24obs.com/${_url}`;
    }

    return '';
  }

  export function getParams(searchParams: ReadonlyURLSearchParams, _keys?: string[]): Record<string, string> {
    const getValue = (key: string): [string, string | null] => {
      return [key, searchParams.get(key)];
    };
    const excludeNull = (value: [string, string | null]) => !!value[1];

    let keys: string[] = [];
    if (_keys) {
      keys = _keys;
    } else {
      keys = Array.from(searchParams.keys());
    }

    return pipe(keys, map(getValue), filter(excludeNull), fromEntries) as Record<string, string>;
  }
}

export default ApiUtils;
