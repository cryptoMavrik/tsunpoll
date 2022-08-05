import { PollQuestion, Prisma, Vote } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{ id: string }> = ({ id }) => {
    const { data } = trpc.useQuery(["questions.get-by-id", { id }]);
    const router = useRouter()
    let totalVotes = 0;

    const { mutate, data: voteResponse } = trpc.useMutation(
        "questions.vote-on-question",
        {
            onSuccess: () => {
                voteResponse?.map((choice: { _count: number }) => {
                    totalVotes += choice._count;
                });
                router.reload()
            },
            onError: () => {
                console.log("Already Voted?");
            }

        }
    );

    if (!data || !data?.question) {
        return <div>Question not found</div>;
    }

    const getTotalVotes = (votes: any) => {
        console.log("Total votes", { votes });

        votes?.map((choice: { choice: number, _count: number }) => {
            totalVotes += choice._count;
        });
    };

    const getPercent = (voteCount: any) => {
        if (voteCount !== undefined && totalVotes > 0)
            return (voteCount / totalVotes) * 100;
        else if (voteCount === undefined) return 0;
    };

    if (data && data !== undefined) {
        getTotalVotes(data.votes);
    }

    return (
        <div className="p-6 min-h-screen w-screen">
            <Head>
                <title>Question | OnAVote</title>
            </Head>
            <header className="flex w-full justify-between mb-10 items-center">
                <Link href={"/"}>
                    <div className="text-lg font-bold cursor-pointer">&larr; go back</div>
                </Link>
                {data?.isOwner && (
                    <div className="bg-emerald-900 rounded-md p-3">Admin</div>
                )}
            </header>

            <main className="max-w-2xl mx-auto flex flex-col">
                <h1 className="text-4xl font-bold mb-10 text-center">
                    {data?.question?.question}
                </h1>
                <h2 className="text-xl font-bold mb-10 text-center">
                    {data?.isOwner || !data?.vote ? "Select your choice" : "Results"}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {data && (data?.isOwner || data?.vote) ?
                        (data?.question?.options as string[])?.map((option, index) => {
                            const currentVote = data?.votes?.find((vote) => vote.choice === index)
                            return (
                                <div key={index} className="flex flex-col items-center justify-center border-2 rounded-xl p-5 border-[#0099aa]">
                                    <div className="flex justify-center items-center w-full p-3">
                                        <div className="font-bold text-center text-2xl w-full">{(option as any).text}</div>
                                    </div>
                                    <div className="text-center font-semibold p-1 opacity-50">
                                        <p className="text-2xl">
                                            {getPercent(currentVote?._count)?.toFixed()}%
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                        :
                        (data?.question?.options as string[])?.map((option, index) => {
                            return (<>
                                <button
                                    onClick={() => {
                                        console.log("Voting", index);
                                        mutate({ questionId: data?.question!.id, option: index })
                                    }
                                    }
                                    key={index}
                                    className="btn btn-outline"
                                >
                                    <div key={index} className="flex justify-center items-center font-bold text-2xl w-full border-2 rounded-xl p-5 border-[#0099aa]">
                                        {(option as any).text}
                                    </div>
                                </button>
                            </>
                            )
                        })}
                </div>
                <div className="text-right pt-5">
                    {`Total Votes: ${totalVotes} `}
                </div>

            </main>
        </div>
    );
};

const QuestionPage = () => {
    const { query } = useRouter();
    const { id } = query;

    if (!id || typeof id !== "string") {
        return <div>No ID</div>;
    }

    return <QuestionsPageContent id={id} />;
};

export default QuestionPage;