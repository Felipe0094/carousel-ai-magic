
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface PromptData {
  tema: string;
  conteudo: string;
  quantidadeImagens: number;
  promptPrincipal: string;
}

interface GeneratedPrompt {
  id: string;
  titulo: string;
  prompt: string;
  descricao: string;
  indice: number;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePrompts(data: PromptData): Promise<GeneratedPrompt[]> {
    const systemPrompt = `
Você é um especialista em criação de prompts para IA geradora de imagens, focado em conteúdo comercial para Instagram no estilo carrossel.

Baseado nos dados fornecidos, gere ${data.quantidadeImagens} prompts únicos e específicos para cada slide do carrossel.

DADOS:
- Tema: ${data.tema}
- Conteúdo: ${data.conteudo}
- Prompt Principal: ${data.promptPrincipal}
- Quantidade de Imagens: ${data.quantidadeImagens}

INSTRUÇÕES:
1. Cada prompt deve ser único e complementar aos outros
2. Mantenha consistência visual entre os slides
3. Foque em elementos comerciais e apelo visual para Instagram
4. Use descrições detalhadas de estilo, cores, composição e elementos visuais
5. Inclua aspectos como iluminação, ângulo, mood e atmosfera

FORMATO DE RESPOSTA (JSON):
[
  {
    "titulo": "Slide 1 - [Título descritivo]",
    "prompt": "[Prompt detalhado para geração da imagem]",
    "descricao": "[Breve descrição do que a imagem representa no contexto do carrossel]"
  }
]

Retorne APENAS o JSON, sem texto adicional.
    `;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const result: GeminiResponse = await response.json();
      const generatedText = result.candidates[0]?.content?.parts[0]?.text;

      if (!generatedText) {
        throw new Error('Resposta vazia da API do Gemini');
      }

      // Extrair o JSON da resposta
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Formato de resposta inválido');
      }

      const prompts = JSON.parse(jsonMatch[0]);
      
      return prompts.map((prompt: any, index: number) => ({
        id: `prompt-${Date.now()}-${index}`,
        titulo: prompt.titulo,
        prompt: prompt.prompt,
        descricao: prompt.descricao,
        indice: index + 1
      }));

    } catch (error) {
      console.error('Erro ao gerar prompts:', error);
      throw new Error(`Falha ao gerar prompts: ${error.message}`);
    }
  }
}
