import { NextResponse } from "next/server";
import { proxyAuthRequest } from "@/lib/authProxy";

export async function POST() {
    const { response, data } = await proxyAuthRequest({
        path: "/verify",
        forwardCookies: true,
    });

    return NextResponse.json(data, { status: response.status });
}
