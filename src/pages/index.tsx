import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading, error } = trpc.useQuery(["questions.get-all"])
  const router = useRouter()
  console.log("DATA", data);

  const handleClick = (id: string) => {
    router.replace(`/poll/${id}`)
  }

  if (isLoading) {
    return <div className="h-screen w-full flex justify-center items-center text-3xl">Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Polls</title>
      </Head>
      <div className="flex flex-col w-full h-screen overflow-hidden justify-center items-center py-[2rem]">
        <div className="flex absolute top-5 justify-between w-2/3 px-[4rem]">
          <h1 className='text-5xl font-bold mb-10 text-center'>
            Polls
          </h1>
          <button className="inline-flex justify-center items-center font-bold bg-[#0099aa] w-[12rem] h-10 rounded-lg" onClick={() => router.replace("/create")}>
            Create a poll
          </button>
        </div>
        {data?.length !== 0 && <>
          <div className='flex flex-wrap gap-2 justify-center items-center w-1/2'>
            {data?.map((question: any, index: number) => {
              return (
                <div key={index}>
                  <button className='border-2 border-[#0099aa] p-3 rounded-xl w-max' onClick={() => handleClick(question.id)}>
                    <h1>{question.question}</h1>
                  </button>
                  <div className="p-4"></div>
                </div>
              )
            })}
          </div>
        </>
        }
      </div>
    </>
  )
}
export default Home;
