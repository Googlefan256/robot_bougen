import { loadImage, createCanvas, GlobalFonts } from "@napi-rs/canvas";
import { Hono } from "hono";
import { serve } from '@hono/node-server';

GlobalFonts.registerFromPath("./NotoSansJP-Regular.ttf", "Noto Sans JP");
const img = await loadImage("./base.jpg");

async function generate(content) {
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    ctx.font = "30px 'Noto Sans JP'";
    ctx.fillStyle = "black";
    const w = ctx.measureText(content).width;
    if (w < 400) {
        ctx.fillText(content, (315 - w / 2), 200, 315 + w / 2);
    } else {
        ctx.fillText(content, 115, 200, 400);
    }
    return canvas.toBuffer("image/png");
}

const app = new Hono();

app.get("/", async (ctx) => {
    const content = ctx.req.query("content");
    if (!content) return new Response("Please provide content query parameter", {
        headers: {
            "Content-Type": "text/plain",
        }
    });
    const img = await generate(content);
    return new Response(img, {
        headers: {
            "Content-Type": "image/png"
        },
    })
});


serve({ fetch: app.fetch, port: 3030 }, (addr) => {
    console.log(`Server started at ${addr.port}`);
});