import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "mcp-calculator",
    version: "1.0.0",
    capabilities: { tools: {} },
});


server.tool(
    "add",
    "Adds two numbers.",
    {
        a: z.number().describe("The first number to add."),
        b: z.number().describe("The second number to add."),
    },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a + b) }],
    }),
);

server.tool(
    "calculate_subtract",
    "Subtracts the second number from the first.",
    {
        a: z.number().describe("The number to subtract from."),
        b: z.number().describe("The number to subtract."),
    },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a - b) }],
    }),
);

server.tool(
    "calculate_multiply",
    "Multiplies two numbers.",
    {
        a: z.number().describe("The first number to multiply."),
        b: z.number().describe("The second number to multiply."),
    },
    async ({ a, b }) => ({
        content: [{ type: "text", text: String(a * b) }],
    }),
);

server.tool(
    "calculate_divide",
    "Divides the first number by the second.",
    {
        a: z.number().describe("The dividend (number being divided)."),
        b: z
            .number()
            .describe("The divisor (number to divide by). Cannot be zero."),
    },
    async ({ a, b }) => {
        if (b === 0) {
            return {
                content: [{ type: "text", text: "Error: Division by zero." }],
                isError: true,
            };
        }
        return {
            content: [{ type: "text", text: String(a / b) }],
        };
    },
);


async function main() {
    try {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.log("Calculator MCP Server connected via stdio and ready.");
    } catch (error) {
        console.error("Failed to start or connect the server:", error);
        process.exit(1);
    }
}

process.on("SIGINT", async () => {
    console.error("\nCaught interrupt signal (Ctrl+C). Shutting down...");
    await server.close(); // Close the server gracefully
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.error("Caught termination signal. Shutting down...");
    await server.close();
    process.exit(0);
});

main();