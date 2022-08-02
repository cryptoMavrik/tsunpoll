import { PollQuestion, Prisma, Vote } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionsPageContent: React.FC<{ id: string }> = ({ id }) => {
    const { data } = trpc.useQuery(["questions.get-by-id", { id }]);
    let totalVotes = 0;

    const { mutate, data: voteResponse } = trpc.useMutation(
        "questions.vote-on-question",
        {
            onSuccess: () => {
                voteResponse?.map((choice: { _count: number }) => {
                    totalVotes += choice._count;
                });
                window.location.reload();
            },
        }
    );

    if (!data || !data?.question) {
        return <div>Question not found</div>;
    }

    const getTotalVotes = (votes: any) => {
        votes?.map((choice: { _count: number }) => {
            totalVotes += choice._count;
        });
    };

    const getPercent = (voteCount: any) => {
        if (voteCount !== undefined && totalVotes > 0)
            return (voteCount / totalVotes) * 100;
        else if (voteCount == undefined) return 0;
    };

    if (data && data != undefined) getTotalVotes(data.votes);

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

            <main className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-10 text-center">
                    {data?.question?.question}
                </h1>
                <h2 className="text-xl font-bold mb-10 text-center">
                    Select your choice:
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {(data?.question?.options as string[])?.map((option, index) => {
                        if (data?.isOwner || data?.vote) {
                            return (
                                <div key={index} className="flex flex-col items-center justify-center border border-solid rounded-xl p-5 border-gray-600">
                                    <div className="flex space-between items-center w-full p-3">
                                        <div className="font-bold text-2xl w-full">{(option as any).text}</div>
                                        <div className="font-bold text-xl">
                                            {getPercent(data?.votes?.[index]?._count)?.toFixed()}%
                                        </div>
                                    </div>
                                    <progress
                                        className="w-full rounded-xl max-h-1 bg-emerald-700 p-1 my-2"
                                        value={data?.votes?.[index]?._count ?? 0}
                                        max={totalVotes}
                                    ></progress>
                                </div>
                            );
                        }

                        return (
                            <div className="flex space-between items-center w-full border border-solid rounded-xl p-5 border-gray-500">
                                <button
                                    onClick={() =>
                                        mutate({ questionId: data.question!.id, option: index })
                                    }
                                    key={index}
                                    className="btn btn-outline"
                                >
                                    {(option as any).text}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <div className="text-center font-semibold p-10">
                    Total Votes: {totalVotes}
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