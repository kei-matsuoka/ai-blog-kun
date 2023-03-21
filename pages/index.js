import Head from "next/head";
import { useState } from "react";
import { Spinner } from "./components/Spinner";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log(data.result);
      setResult(data.result);
      setAnimalInput("");
      setLoading(false);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <>
      <div>
        <Head>
          <title>AIブログくん</title>
          <meta name="description" content="AIでブログ記事を自動生成するWebサービスです。" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h3>AIブログくん</h3>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="animal"
              placeholder="記事のタイトルを入力する"
              value={animalInput}
              onChange={(e) => setAnimalInput(e.target.value)}
            />
            <input type="submit" value="作成" />
          </form>
          <div className={styles.result} dangerouslySetInnerHTML={{ __html: result }} />
        </main>
      </div>
      {loading && <Spinner/>}
    </>
  );
}
