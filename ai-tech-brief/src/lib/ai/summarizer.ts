import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  }
  return geminiClient;
}

const TRANSLATE_PROMPT = `당신은 IT/기술 분야 전문 번역가입니다.
영어 뉴스 제목을 한국어로 자연스럽게 번역해주세요.

규칙:
- 직역하지 말고 한국 뉴스 기사 제목처럼 자연스럽게 의역하세요
- 기술 용어는 한국에서 일반적으로 사용하는 표현을 사용하세요 (예: AI, ChatGPT 등은 그대로 유지)
- 간결하고 임팩트 있게 작성하세요
- 번역된 제목만 출력하세요, 다른 설명 없이`;

const SUMMARY_PROMPT = `당신은 AI/기술 뉴스 전문 에디터입니다.
기사 내용을 읽고 핵심 포인트 3가지를 뽑아주세요.

규칙:
- 각 포인트는 1~2문장으로 충분히 설명해주세요 (80~120자)
- "~했다", "~한다" 등 뉴스 문체로 작성하세요
- 독자가 기사를 읽지 않아도 내용을 파악할 수 있도록 구체적으로 작성하세요
- 번호나 기호 없이, 각 포인트를 줄바꿈으로 구분해주세요
- 총 3줄만 출력하세요`;

const INSIGHT_PROMPT = `당신은 IT 전문 칼럼니스트입니다.
기사를 읽고 독자에게 인사이트를 제공해주세요.

다음 형식으로 작성해주세요:

💡 핵심 포인트
(이 기사에서 가장 주목할 점을 2~3문장으로)

🔮 앞으로의 전망
(이 기술/소식이 업계에 미칠 영향을 2~3문장으로)

📌 알아두면 좋은 점
(일반 독자가 이해하면 좋을 배경 지식이나 맥락을 1~2문장으로)

규칙:
- 전문 용어는 쉽게 풀어서 설명하세요
- 친근하지만 전문적인 톤으로 작성하세요
- 총 250~350자 내외로 작성하세요`;

export async function generateSummary(content: string): Promise<string[]> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `${SUMMARY_PROMPT}\n\n다음 기사를 3줄로 요약해주세요:\n\n${content}`;
    const result = await model.generateContent(prompt);
    const responseContent = result.response.text();

    // Parse the response into lines and clean them
    const lines = responseContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        // Remove common prefixes like "1.", "2.", "-", etc.
        return line.replace(/^[\d]+\.\s*/, '').replace(/^[-•]\s*/, '').trim();
      })
      .filter((line) => line.length > 0)
      .slice(0, 3);

    // Ensure we always return 3 items
    while (lines.length < 3) {
      lines.push('');
    }

    return lines;
  } catch (error) {
    console.error('Error generating summary:', error);
    return [];
  }
}

export async function translateTitle(title: string): Promise<string> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `${TRANSLATE_PROMPT}\n\n번역할 제목: ${title}`;
    const result = await model.generateContent(prompt);

    return result.response.text().trim();
  } catch (error) {
    console.error('Error translating title:', error);
    return title; // 번역 실패 시 원본 반환
  }
}

export async function generateInsight(content: string): Promise<string> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `${INSIGHT_PROMPT}\n\n다음 기사의 기술적 인사이트를 분석해주세요:\n\n${content}`;
    const result = await model.generateContent(prompt);

    return result.response.text().trim();
  } catch (error) {
    console.error('Error generating insight:', error);
    return '';
  }
}
