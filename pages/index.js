import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'


const asciimath2latex = require('asciimath-to-latex')

export default function Home () {

  function replaceAll (str, searchStr, replaceStr) {

    return str.split(searchStr).join(replaceStr);
  }

  function ascToHwpMath (text) {
    const temp = "HJKG"
    //const text = "아래의 그림과 같이 `/_A=40˚`이고, `bar (AB)=bar (AC)`인 이등변삼각형 `ABC`의 외심을 `O`, 내심을 `I`라 할 때, `/_OBI`의 크기는?"

    let rmflag = true;
    let parsed = "";
    for (let i = 0; i < text.length; i++) {
      if (!rmflag && text[i] == " ") {
        parsed += ""
      } else {
        parsed += text[i]
      }
      if (text[i] == "`") {
        rmflag = !rmflag;
      }
    }
    const whsp = replaceAll(parsed, " ", temp)
    const arr = whsp.split('`')
    const aft = arr.map(item => {
      if (item.length > 0) {
        return asciimath2latex(item)
      }
    })
    const dollor = aft.join(`$`)
    let flag = true;
    let nodollor = ""
    for (let i = 0; i < dollor.length; i++) {
      if (dollor[i] === "$") {
        if (flag) {
          flag = !flag
          nodollor += "{"
        } else {
          flag = !flag
          nodollor += "}"
        }
      } else {
        nodollor += dollor[i]
      }
    }

    const rm = replaceAll(nodollor, "\\", "")
    const mkw = replaceAll(rm, "{H}{J}{K}{G}", "{\\ }")
    console.log(mkw)
    return (mkw)
  }

  const [text, setText] = useState("")
  const [rlt, setRlt] = useState("")

  return (
    <div className={styles.container}>
      <Head>
        <title>asciimath to hwp math</title>
        <meta name="description" content="asciimath to hwp math" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          asciimath to hwp 수식 변환기
        </p>
        <input style={{ width: "80vw" }} placeholder="asciimath 가 포함된 한글 문장 입력" value={text} onChange={(e) => {
          setText(e.target.value)
        }} />
        <button onClick={() => {
          setRlt(ascToHwpMath(text))
        }}>
          변환하기
        </button>


        <p className={styles.description}>
          결과물 : {rlt}

        </p>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/budlebee/asciimath-to-hwpmath"
          target="_blank"
          rel="noopener noreferrer"
        >
          by budlebee

        </a>
      </footer>
    </div>
  )
}
