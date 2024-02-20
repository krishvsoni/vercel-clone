import { join } from "path";
import { uploadFile } from "./aws";

const path = join(__dirname, "../dist");
const files = getAllFiles(path);

async function getAllFiles(dir: string): Promise<string[]> {
    const files = [];
    const items = await fs.promises.readdir(dir);

    for (const item of items) {
        const fullPath = join(dir, item);
        const stats = await fs.promises.stat(fullPath);

        if (stats.isDirectory()) {
            files.push(...(await getAllFiles(fullPath)));
        } else {
            files.push(fullPath);
        }
    }

    return files;
}

app.get("/*", async (req, res) => {
    // id.100xdevs.com
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);