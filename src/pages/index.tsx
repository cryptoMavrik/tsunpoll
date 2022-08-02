import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading, error } = trpc.useQuery(["questions.get-all"])
  const router = useRouter()

  const handleClick = (id: string) => {
    router.replace(`/question/${id}`)
  }

  if (isLoading) {
    return <div className="h-screen w-full flex justify-center items-center text-3xl">Loading...</div>
  }

  return (
    <>
      <div className="flex flex-col w-full overflow-hidden justify-start items-center mt-[10rem]">
        <Head>
          <title>Polls</title>
        </Head>

        <h1 className='text-7xl font-bold mb-10 text-center'>
          Polls
        </h1>
        <div className='flex flex-wrap gap-2 justify-center items-center w-1/2'>
          {data?.map((question: any, index: number) => {
            return (
              <div key={index}>
                <button className='bg-emerald-700 p-3 rounded-xl w-max' onClick={() => handleClick(question.id)}>
                  <h1>{question.question}</h1>
                </button>
                <div className="p-4"></div>
              </div>
            )
          })}
        </div>
        <br />
        ------------------------------
        <h1 className='text-3xl font-semibold my-10 text-center'>
          Create Poll
        </h1>
        <button className="font-bold py-2 bg-emerald-700 w-[12rem] rounded-lg" onClick={() => router.replace("/create")}>
          Go
        </button>
      </div>
    </>
  )
}
export default Home;