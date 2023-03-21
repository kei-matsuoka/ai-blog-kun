import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      max_tokens: 2000,
    });
    console.log(completion.data.choices[0].text)
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  let goal = animal
  return (`
以下の内容でブログの記事をHTML形式（bodyタグより中のみ）で作成してください。
- 記事のタイトル: ${goal}
- 記事の概要: 人を怒らせる方法を具体例を交えながら説明する
- 記事の構成: 導入、3セクション、結論
- キーワードリスト: 怒り, テクニック, 方法, 怒らせる
- 記事の目的: 読者に人を怒らせる方法を学んでもらい、人間関係を良くする方法を学んでもらう
- ターゲットオーディエンス: 面白くてためになる記事を読みたい読者
- 記事のムード: インフォーマル
- 文字数制限: 2000文字

例
<h1>記事のタイトル<h1>
<p>導入</p>
<h2>セクションのタイトル</h2>
<p>セクションの内容</p>
<p>結論</p>
  `);
}
