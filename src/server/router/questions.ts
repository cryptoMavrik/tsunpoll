import { resolve } from "path";
import React from "react";
import { z } from "zod";
import { createQuestionValidator } from "../../shared/creation-validator";
import { prisma } from "../db/client";
import { createRouter } from "./context";

export const questionRouter = createRouter()
    .query("get-all-mine", {
        async resolve({ ctx }) {
            if (!ctx.token) return [];
            return await prisma?.pollQuestion.findMany({
                where: {
                    ownerToken: {
                        equals: ctx.token,
                    },
                },
            });
        },
    })
    .query("get-all", {
        async resolve() {
            return await prisma?.pollQuestion.findMany({});
        }
    })
    .query("get-by-id", {
        input: z.object({ id: z.string() }),
        async resolve({ input, ctx }) {
            const question = await prisma.pollQuestion.findFirst({
                where: {
                    id: input.id,
                },
            });

            const myVote = await prisma.vote.findFirst({
                where: {
                    questionId: input.id,
                    voterToken: ctx.token,
                },
            });

            const rest = {
                question,
                vote: myVote,
                isOwner: question?.ownerToken === ctx.token,
            };

            if (rest.vote || rest.isOwner) {
                const votes = await prisma.vote.groupBy({
                    where: {
                        questionId: input.id,
                    },
                    by: ["questionId"],
                    _count: true,
                });

                return {
                    ...rest,
                    votes,
                };
            }
            return {
                ...rest,
                votes: undefined,
            };
        },
    })
    .mutation("vote-on-question", {
        input: z.object({
            questionId: z.string(),
            option: z.number().min(0).max(10),
        }),
        async resolve({ input, ctx }) {
            if (!ctx.token) throw new Error("Not Authorized");
            await prisma.vote.create({
                data: {
                    questionId: input.questionId,
                    choice: input.option,
                    voterToken: ctx.token,
                },
            });
            return await prisma.vote.groupBy({
                where: { questionId: input.questionId },
                by: ["choice"],
                _count: true,
            });
        },
    })
    .mutation("create", {
        input: createQuestionValidator,
        async resolve({ input, ctx }) {
            if (!ctx.token) throw new Error("Not Authorized");
            return await prisma.pollQuestion.create({
                data: {
                    question: input.question,
                    options: input.options,
                    ownerToken: ctx.token,
                },
            });
        }
    });
