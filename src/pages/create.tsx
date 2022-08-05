import React from "react";
import { trpc } from "../utils/trpc";

import { useFieldArray, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    CreateQuestionInputType,
    createQuestionValidator,
} from "../shared/creation-validator";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

const CreateQuestionForm = () => {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateQuestionInputType>({
        resolver: zodResolver(createQuestionValidator),
        defaultValues: {
            options: [{ text: "Yes" }, { text: "No" }],
        },
    });

    const { fields, append, prepend, remove, swap, move, insert } =
        useFieldArray<CreateQuestionInputType>({
            name: "options", // unique name for your Field Array,
            control, // control props comes from useForm (optional: if you are using FormContext)
        });

    const { mutate, isLoading, data } = trpc.useMutation("questions.create", {
        onSuccess: (data) => {
            router.push(`/poll/${data.id}`);
        },
    });

    if (isLoading || data)
        return (
            <div className="antialiased min-h-screen flex items-center justify-center">
                <div className="h-screen w-full flex justify-center items-center text-3xl">Loading...</div>
            </div>
        );

    return (
        <div className="antialiased text-gray-100 p-6 min-h-screen ">
            <Head>
                <title>Create</title>
            </Head>
            <header className="header flex w-full justify-between">
                <Link href={"/"}>
                    <div className="text-lg font-bold cursor-pointer">&larr; go back</div>
                </Link>
            </header>
            <div className="flex flex-col justify-center items-center max-w-2xl m-auto mt-[5rem] py-10 md:max-w-2xl border-2 border-[#0099aa] px-16 rounded-md">
                <h2 className="text-4xl font-bold text-center">Create new poll</h2>

                <form
                    onSubmit={handleSubmit((data) => {
                        console.log("Data", data);

                        mutate(data);
                    })}
                    className="w-full"
                >
                    <div className="mt-8 w-full">
                        <div className="form-control my-10 w-full">
                            <div className="text-lg p-1">
                                Your Question
                            </div>
                            <input
                                {...register("question")}
                                type="text"
                                className="w-full block text-gray-900 rounded-lg px-2 py-3 text-xl outline-[#4ba8ff8a]"
                                placeholder="ex. What's your favorite color?"
                                autoComplete="off"
                            />
                            {errors.question && (
                                <p className="text-red-400">{errors.question.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 w-full gap-x-5 gap-y-3 p-3">
                            <div className="flex w-full justify-center font-semibold text-lg">
                                Options
                            </div>
                            {fields.map((field, index) => {
                                return (
                                    <div key={field.id}>
                                        <section
                                            className="flex items-center space-x-3"
                                            key={field.id}
                                        >
                                            <input
                                                placeholder="name"
                                                {...register(`options.${index}.text`, {
                                                    required: true,
                                                })}
                                                className="input input-bordered outline-[#4ba8ff8a] w-full text-gray-500 font-semibold p-2 rounded-lg"
                                                autoComplete="off"
                                            />
                                            <button type="button" onClick={() => remove(index)} >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-gray-500 ml-[-3rem]"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </section>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-end justify-center my-3">
                            <button
                                type="button"
                                value="Add more options"
                                className="btn btn-ghost"
                                onClick={() => append({ text: "Another Option" })}
                            >
                                + Add option
                            </button>
                        </div>
                        <div className="flex justify-center w-full mt-10">
                            <button
                                type="submit"
                                className="font-bold py-2 border-2 border-white-900 w-[12rem] rounded-lg"
                            >
                                Create Poll
                            </button>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const QuestionCreator: React.FC = () => {
    return <CreateQuestionForm />;
};

export default QuestionCreator;