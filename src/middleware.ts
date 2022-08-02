

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    if (req.cookies.get("poll-token")) return;

    const random = nanoid();

    // Redirect (to apply cookie)
    const res = NextResponse.redirect(req.nextUrl);

    res.cookies.set("poll-token", random, { sameSite: "strict" });

    return res;
}