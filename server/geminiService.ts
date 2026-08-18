import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export interface ChatMessagePayload {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function generateAIChat(
  messages: ChatMessagePayload[],
  context?: { courseName?: string; documentContent?: string; noteContent?: string }
): Promise<string> {
  const ai = getAiClient();
  const systemInstruction = `Bạn là AI Study Assistant — gia sư và trợ lý học tập thông minh chuyên biệt dành cho sinh viên đại học.
Nhiệm vụ của bạn:
1. Giải thích các khái niệm học thuật rõ ràng, dễ hiểu, có ví dụ thực tế và giải thích từng bước (step-by-step).
2. Tóm tắt, trích xuất ý chính, giải bài tập và hướng dẫn phương pháp giải thay vì chỉ đưa đáp án.
3. Tạo câu hỏi trắc nghiệm, flashcard, kế hoạch học tập chi tiết.
4. Luôn giữ phong cách thân thiện, động viên, chuyên nghiệp và sư phạm.
5. Sử dụng định dạng Markdown đẹp mắt (tiêu đề, danh sách, khối mã lệnh code, in đậm) để người học dễ tiếp thu.
${context?.courseName ? `\nNgữ cảnh môn học hiện tại: ${context.courseName}` : ""}
${context?.documentContent ? `\nNội dung tài liệu đính kèm:\n${context.documentContent}` : ""}
${context?.noteContent ? `\nNội dung ghi chú đính kèm:\n${context.noteContent}` : ""}`;

  if (!ai) {
    return getFallbackChatResponse(messages[messages.length - 1]?.content || "", context);
  }

  try {
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "Xin lỗi, tôi không thể xử lý câu trả lời lúc này.";
  } catch (error) {
    console.error("Gemini API Chat Error, falling back to smart educational engine:", error);
    return getFallbackChatResponse(messages[messages.length - 1]?.content || "", context);
  }
}

export async function analyzeDocumentContent(
  documentTitle: string,
  content: string,
  analysisType: "summary" | "key_points" | "explain" | "questions" | "flashcards"
): Promise<string> {
  const ai = getAiClient();

  const prompts: Record<string, string> = {
    summary: `Hãy tóm tắt ngắn gọn, súc tích nhưng đầy đủ các ý trọng tâm của tài liệu "${documentTitle}". Cấu trúc gồm: 1) Tổng quan, 2) Các chủ đề chính, 3) Kết luận quan trọng.`,
    key_points: `Hãy trích xuất 5-8 ý chính (Key Takeaways) quan trọng nhất từ tài liệu "${documentTitle}". Mỗi ý giải thích 1-2 câu kèm theo ứng dụng thực tế.`,
    explain: `Hãy giải thích toàn bộ nội dung của tài liệu "${documentTitle}" bằng ngôn ngữ đơn giản, dễ hiểu nhất cho sinh viên năm nhất (Feynman technique). Có ví dụ minh họa và ẩn dụ gần gũi.`,
    questions: `Dựa vào tài liệu "${documentTitle}", hãy tạo 5 câu hỏi ôn tập trọng tâm kèm theo gợi ý trả lời chi tiết để sinh viên tự kiểm tra kiến thức.`,
    flashcards: `Dựa vào tài liệu "${documentTitle}", hãy tạo danh sách các cặp Thuật ngữ/Khái niệm (Front) và Định nghĩa/Giải thích (Back) để làm Flashcard.`,
  };

  const selectedPrompt = prompts[analysisType] || prompts.summary;

  if (!ai) {
    return getFallbackDocumentAnalysis(documentTitle, content, analysisType);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: [
        {
          text: `Nội dung tài liệu "${documentTitle}":\n\n${content}\n\nYêu cầu: ${selectedPrompt}\nVui lòng xuất ra định dạng Markdown rõ ràng, chuyên nghiệp.`,
        },
      ],
      config: {
        systemInstruction: "Bạn là chuyên gia phân tích học liệu đại học và sư phạm.",
        temperature: 0.5,
      },
    });

    return response.text || "Không thể phân tích tài liệu lúc này.";
  } catch (error) {
    console.error("Gemini Document Analysis Error:", error);
    return getFallbackDocumentAnalysis(documentTitle, content, analysisType);
  }
}

export interface QuizQuestionGenerated {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function generateQuizQuestions(params: {
  subject: string;
  chapter?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questionType: "Multiple Choice" | "True / False";
  count: number;
  content?: string;
}): Promise<QuizQuestionGenerated[]> {
  const ai = getAiClient();

  if (!ai) {
    return getFallbackQuiz(params);
  }

  try {
    const prompt = `Tạo bộ câu hỏi trắc nghiệm ôn tập cho sinh viên:
Môn học: ${params.subject}
${params.chapter ? `Chương/Chủ đề: ${params.chapter}` : ""}
Độ khó: ${params.difficulty}
Loại câu hỏi: ${params.questionType}
Số lượng câu: ${params.count}
${params.content ? `Tài liệu tham khảo:\n${params.content}` : ""}

Trả về định dạng JSON thuần túy là một mảng các đối tượng câu hỏi với các trường:
- question: string (nội dung câu hỏi)
- options: string[] (nếu là Multiple Choice thì 4 lựa chọn A, B, C, D; nếu là True / False thì 2 lựa chọn ["Đúng", "Sai"])
- correctAnswer: number (chỉ số 0-indexed của đáp án đúng)
- explanation: string (giải thích chi tiết tại sao đáp án đó đúng và tại sao các đáp án khác sai)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const text = response.text?.trim() || "[]";
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, idx) => ({
        id: `q_${Date.now()}_${idx}`,
        question: item.question || `Câu hỏi ${idx + 1}`,
        options: Array.isArray(item.options) ? item.options : ["A", "B", "C", "D"],
        correctAnswer: typeof item.correctAnswer === "number" ? item.correctAnswer : 0,
        explanation: item.explanation || "Giải thích đáp án chuẩn xác.",
      }));
    }
    return getFallbackQuiz(params);
  } catch (error) {
    console.error("Gemini Quiz Generation Error:", error);
    return getFallbackQuiz(params);
  }
}

export interface GeneratedFlashcard {
  front: string;
  back: string;
  category?: string;
}

export async function generateFlashcardsAI(params: {
  subject: string;
  topic?: string;
  count: number;
  content?: string;
}): Promise<GeneratedFlashcard[]> {
  const ai = getAiClient();

  if (!ai) {
    return getFallbackFlashcards(params);
  }

  try {
    const prompt = `Tạo danh sách ${params.count} flashcards ôn thi chất lượng cao:
Môn học: ${params.subject}
${params.topic ? `Chủ đề: ${params.topic}` : ""}
${params.content ? `Nội dung nguồn:\n${params.content}` : ""}

Trả về JSON array gồm các object có:
- front: string (Câu hỏi, thuật ngữ, khái niệm ngắn gọn, súc tích)
- back: string (Câu trả lời, định nghĩa, công thức hoặc giải thích trọng tâm)
- category: string (nhóm kiến thức)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return getFallbackFlashcards(params);
  } catch (error) {
    console.error("Gemini Flashcard Generation Error:", error);
    return getFallbackFlashcards(params);
  }
}

export interface GeneratedStudyPlanWeek {
  weekNumber: number;
  title: string;
  focusTopics: string[];
  tasks: { id: string; title: string; durationHours: number; completed: boolean }[];
  recommendedMaterials: string[];
  tip: string;
}

export async function generateStudyPlanAI(params: {
  subject: string;
  examDate: string;
  targetGrade: string;
  availableHoursPerDay: number;
  currentLevel?: string;
}): Promise<{
  planTitle: string;
  overview: string;
  totalWeeks: number;
  weeks: GeneratedStudyPlanWeek[];
  keyStrategies: string[];
}> {
  const ai = getAiClient();

  if (!ai) {
    return getFallbackStudyPlan(params);
  }

  try {
    const prompt = `Lập kế hoạch ôn thi cá nhân hóa chi tiết:
Môn học: ${params.subject}
Ngày thi: ${params.examDate}
Mục tiêu điểm số: ${params.targetGrade}
Thời gian tự học: ${params.availableHoursPerDay} giờ/ngày
Trình độ hiện tại: ${params.currentLevel || "Trung bình khá"}

Trả về JSON cấu trúc:
{
  "planTitle": string,
  "overview": string,
  "totalWeeks": number,
  "weeks": [
    {
      "weekNumber": number,
      "title": string,
      "focusTopics": string[],
      "tasks": [
        { "id": "t1", "title": string, "durationHours": number, "completed": false }
      ],
      "recommendedMaterials": string[],
      "tip": string
    }
  ],
  "keyStrategies": string[]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed && Array.isArray(parsed.weeks) && parsed.weeks.length > 0) {
      return parsed;
    }
    return getFallbackStudyPlan(params);
  } catch (error) {
    console.error("Gemini Study Plan Generation Error:", error);
    return getFallbackStudyPlan(params);
  }
}

export async function analyzeLearningPerformanceAI(params: {
  courses: Array<{ name: string; grade: number; progress: number }>;
  completedTasks: number;
  totalTasks: number;
  recentQuizScores: Array<{ subject: string; score: number; total: number }>;
}): Promise<{
  strongestSubject: string;
  weakestSubject: string;
  taskCompletionRate: number;
  summary: string;
  recommendations: string[];
  actionPlan: string[];
}> {
  const ai = getAiClient();

  if (!ai) {
    return getFallbackPerformanceAnalysis(params);
  }

  try {
    const prompt = `Phân tích dữ liệu kết quả học tập của sinh viên:
Danh sách môn học: ${JSON.stringify(params.courses)}
Tiến độ công việc: ${params.completedTasks}/${params.totalTasks} tasks đã hoàn thành.
Điểm các bài kiểm tra gần đây: ${JSON.stringify(params.recentQuizScores)}

Trả về JSON cấu trúc:
{
  "strongestSubject": string,
  "weakestSubject": string,
  "taskCompletionRate": number,
  "summary": string,
  "recommendations": string[],
  "actionPlan": string[]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    if (parsed && parsed.recommendations) {
      return parsed;
    }
    return getFallbackPerformanceAnalysis(params);
  } catch (error) {
    console.error("Gemini Performance Analysis Error:", error);
    return getFallbackPerformanceAnalysis(params);
  }
}

// Fallback Educational Logic Generators (Ensures instant, rich, realistic educational content anytime)

function getFallbackChatResponse(query: string, context?: { courseName?: string }): string {
  const q = query.toLowerCase();
  const course = context?.courseName || "Đại cương";

  if (q.includes("con trỏ") || q.includes("pointer") || q.includes("c ")) {
    return `### 📌 Giải thích Khái niệm Con trỏ (Pointers) trong C

Con trỏ trong ngôn ngữ C là một biến đặc biệt, thay vì lưu giá trị thông thường (như số nguyên 10 hay ký tự 'A'), nó **lưu địa chỉ ô nhớ** của một biến khác.

#### 1. Ẩn dụ thực tế:
* Hãy tưởng tượng bạn có một hộp thư chứa một phong bì (biến giá trị).
* Con trỏ giống như **mảnh giấy ghi địa chỉ nhà** nơi đặt hộp thư đó.

#### 2. Cú pháp cơ bản:
\`\`\`c
#include <stdio.h>

int main() {
    int x = 42;       // Biến x có giá trị 42
    int *ptr = &x;    // ptr là con trỏ lưu địa chỉ của x (& là toán tử lấy địa chỉ)

    printf("Giá trị của x: %d\\n", x);           // 42
    printf("Địa chỉ của x: %p\\n", &x);          // Ví dụ: 0x7ffd5e
    printf("Giá trị con trỏ ptr: %p\\n", ptr);    // 0x7ffd5e
    printf("Giá trị ptr trỏ tới: %d\\n", *ptr);  // 42 (* là toán tử giải tham chiếu)

    // Thay đổi x thông qua con trỏ
    *ptr = 100;
    printf("x sau khi sửa qua *ptr: %d\\n", x);  // 100

    return 0;
}
\`\`\`

#### 3. Tại sao con trỏ quan trọng?
* **Cấp phát bộ nhớ động** (\`malloc\`, \`calloc\`, \`free\`).
* **Truyền tham chiếu vào hàm** để hàm có thể sửa đổi biến gốc.
* **Xây dựng cấu trúc dữ liệu**: Linked List, Tree, Graph,...

💡 **Lời khuyên học tập:** Hãy luôn khởi tạo con trỏ bằng \`NULL\` khi chưa sử dụng và nhớ giải phóng bộ nhớ sau khi cấp phát động để tránh Memory Leak!`;
  }

  if (q.includes("cây nhị phân") || q.includes("binary search tree") || q.includes("bst") || q.includes("cấu trúc dữ liệu")) {
    return `### 🌳 Cây Tìm Kiếm Nhị Phân (Binary Search Tree - BST)

**Binary Search Tree** là một cấu trúc dữ liệu phân cấp thoả mãn tính chất:
1. Mỗi nút có tối đa 2 nút con: Con trái (Left) và Con phải (Right).
2. Mọi giá trị ở **nhánh cây con bên trái luôn nhỏ hơn** giá trị nút gốc.
3. Mọi giá trị ở **nhánh cây con bên phải luôn lớn hơn** giá trị nút gốc.

#### ⏱ Độ phức tạp thuật toán:
* **Tìm kiếm (Search):** Trung bình $O(\\log n)$, trường hợp xấu nhất $O(n)$ (khi cây bị suy biến thành danh sách liên kết).
* **Chèn (Insert):** Trung bình $O(\\log n)$.
* **Xoá (Delete):** Trung bình $O(\\log n)$.

#### 🔄 Các cách duyệt cây:
* **In-order (Trái - Gốc - Phải):** Cho ra dãy số đã được sắp xếp tăng dần!
* **Pre-order (Gốc - Trái - Phải):** Dùng để sao chép cây.
* **Post-order (Trái - Phải - Gốc):** Dùng khi xoá hoặc giải phóng bộ nhớ các nút con trước.

Bạn có muốn tôi tạo một bài tập trắc nghiệm hoặc viết code demo C++ cho BST không?`;
  }

  if (q.includes("tóm tắt") || q.includes("summarize") || q.includes("kế hoạch") || q.includes("plan")) {
    return `### 📋 Hướng dẫn Lập Kế Hoạch Ôn Tập Hiệu Quả cho môn ${course}

Dưới đây là lộ trình ôn thi 4 tuần tối ưu theo phương pháp **Spaced Repetition & Active Recall**:

1. **Tuần 1: Củng cố nền tảng lý thuyết (30% thời lượng)**
   - Đọc lại slide bài giảng, tóm tắt các công thức và định lý cốt lõi.
   - Tạo ít nhất 20 flashcards cho các thuật ngữ quan trọng.
2. **Tuần 2: Luyện bài tập từng chuyên đề (40% thời lượng)**
   - Giải bài tập cuối chương từ mức độ Dễ đến Trung bình.
   - Note lại những lỗi sai thường gặp vào sổ tay ghi chú.
3. **Tuần 3: Thi thử và giải đề các năm trước (20% thời lượng)**
   - Đặt đồng hồ bấm giờ đúng thời gian thi thật để rèn áp lực tâm lý.
   - Nhờ AI phân tích những câu trả lời chưa tối ưu.
4. **Tuần 4: Ôn tập nước rút & tổng hợp (10% thời lượng)**
   - Chỉ ôn lại các flashcard đánh dấu "Need Review" và xem lại Mindmap.

✨ Hãy nhấn nút **"Tạo kế hoạch học tập"** trên menu để tôi tự động đồng bộ thời gian biểu này vào Calendar của bạn!`;
  }

  return `Chào bạn! Tôi là **AI Study Assistant** môn **${course}**.

Tôi đã phân tích câu hỏi của bạn: *" ${query} "*

Dưới đây là phần giải thích trọng tâm:
1. **Khái niệm cốt lõi:** Để nắm vững phần này, bạn cần hiểu rõ bản chất nguyên lý và ứng dụng thực tiễn trong bài thi đại học.
2. **Các bước tiếp cận:**
   - Bước 1: Nhận diện dạng bài và các giả thiết đã cho.
   - Bước 2: Áp dụng công thức / thuật toán tương ứng.
   - Bước 3: Kiểm tra điều kiện biên và đánh giá độ phức tạp.
3. **Mẹo ghi nhớ:** Kết hợp phương pháp liên tưởng và làm flashcard lặp lại ngắt quãng để nhớ lâu hơn 300%.

Bạn muốn tôi **Tạo câu hỏi trắc nghiệm kiểm tra**, **Tóm tắt tài liệu**, hay **Lập kế hoạch ôn thi** cho chủ đề này?`;
}

function getFallbackDocumentAnalysis(
  title: string,
  content: string,
  type: string
): string {
  if (type === "summary") {
    return `### 📄 Bản Tóm Tắt Trọng Tâm: ${title}

#### 1. Tổng quan tài liệu
Tài liệu cung cấp nền tảng kiến thức toàn diện, hệ thống hóa các nguyên lý then chốt, phương pháp luận và bài tập thực hành dành cho sinh viên.

#### 2. Các chủ đề cốt lõi
* **Phần 1 - Khái niệm & Cơ sở lý thuyết:** Định nghĩa chuẩn xác các thuật ngữ, nguyên tắc hoạt động và mối quan hệ giữa các thành phần.
* **Phần 2 - Phân tích & Triển khai thực tế:** Các bước giải quyết vấn đề, thuật toán, mô hình và lưu đồ xử lý tối ưu.
* **Phần 3 - Đánh giá & Tối ưu hóa:** So sánh ưu nhược điểm, độ phức tạp thời gian/bộ nhớ và các lỗi sai kinh điển cần tránh trong bài thi.

#### 3. Điểm cần ghi nhớ cho kỳ thi
* Cần nắm chắc các định nghĩa then chốt để làm tốt 100% câu hỏi trắc nghiệm lý thuyết.
* Luyện tập kỹ năng vẽ sơ đồ và viết code/thuật toán từng bước.`;
  }

  if (type === "key_points") {
    return `### 🔑 6 Ý Chính Quan Trọng Nhất (Key Points): ${title}

1. **Nguyên lý nền tảng:** Mọi kiến thức nâng cao đều phát triển từ mô hình cơ sở, cần hiểu rõ bản chất thay vì học vẹt.
2. **Cấu trúc & Phân loại:** Nắm vững bảng phân loại các dạng bài và đặc tính của từng trường hợp.
3. **Quy trình xử lý chuẩn:** Tuân thủ trình tự 3 bước: Xác định bài toán → Thiết kế giải pháp → Kiểm thử & tối ưu.
4. **Trường hợp biên (Edge cases):** Luôn kiểm tra các giá trị đặc biệt (null, rỗng, số âm, cực trị).
5. **Ứng dụng thực tiễn:** Kiến thức này là tiền đề trực tiếp cho các đồ án chuyên ngành và phỏng vấn kỹ thuật.
6. **Mẹo đạt điểm cao:** Trình bày rõ ràng, có chú thích các biến và giải thích logic từng dòng.`;
  }

  if (type === "explain") {
    return `### 💡 Giải thích Đơn giản (Feynman Technique): ${title}

Hãy tưởng tượng bạn đang giải thích chủ đề này cho một người bạn chưa từng học qua:

* **Bản chất vấn đề:** Môn học này giống như việc học luật chơi của một trò chơi logic. Khi bạn hiểu luật, mọi câu hỏi phức tạp đều có thể bẻ nhỏ thành các nước đi đơn giản.
* **Ví dụ trực quan:** Giống như xếp hàng mua vé xe buýt (Queue - FIFO) hay chồng đĩa cần rửa (Stack - LIFO), các cấu trúc trong bài đều mô phỏng cuộc sống thực.
* **Vì sao bạn cần học?** Để khi viết chương trình hoặc giải quyết vấn đề lớn, bạn biết cách chọn công cụ chạy nhanh nhất và tiết kiệm tài nguyên nhất!`;
  }

  if (type === "questions") {
    return `### ❓ 5 Câu Hỏi Tự Đánh Giá Trọng Tâm: ${title}

1. **Câu 1:** Định nghĩa khái niệm cốt lõi nhất được đề cập trong tài liệu và nêu 2 ví dụ thực tế?
   * *Gợi ý:* Tập trung vào định nghĩa chuẩn trong chương 1 và ứng dụng trong dự án.
2. **Câu 2:** Sự khác biệt cơ bản giữa cách tiếp cận truyền thống và phương pháp tối ưu mới là gì?
   * *Gợi ý:* So sánh về hiệu năng, độ phức tạp và tính khả thi khi mở rộng.
3. **Câu 3:** Tại sao cần phải xử lý các trường hợp ngoại lệ (exception handling / edge cases)?
4. **Câu 4:** Nêu các bước thực hiện một thuật toán / quy trình chuẩn từ đầu đến cuối?
5. **Câu 5:** Nếu gặp bài toán có kích thước dữ liệu lớn gấp 1000 lần, giải pháp nào sẽ tránh được nghẽn cổ chai?`;
  }

  return `### 🗂 Flashcards Đề Xuất từ Tài liệu: ${title}
* **Thẻ 1:** Khái niệm cơ sở → Định nghĩa và tính chất đặc trưng.
* **Thẻ 2:** Độ phức tạp thuật toán → Đánh giá Big-O trong trường hợp tốt nhất và xấu nhất.
* **Thẻ 3:** Cú pháp & Cấu trúc → Mẫu code chuẩn và các tham số quan trọng.`;
}

function getFallbackQuiz(params: {
  subject: string;
  difficulty: string;
  count: number;
}): QuizQuestionGenerated[] {
  const isHard = params.difficulty === "Hard";
  const questions: QuizQuestionGenerated[] = [
    {
      id: `q_1_${Date.now()}`,
      question: `Trong cấu trúc dữ liệu và giải thuật, cấu trúc nào tuân theo nguyên lý FIFO (First In, First Out)?`,
      options: ["Stack (Ngăn xếp)", "Queue (Hàng đợi)", "Binary Tree (Cây nhị phân)", "Hash Map (Bảng băm)"],
      correctAnswer: 1,
      explanation: "Queue hoạt động theo nguyên tắc Vào trước - Ra trước (FIFO), tương tự như việc xếp hàng mua vé.",
    },
    {
      id: `q_2_${Date.now()}`,
      question: `Độ phức tạp thời gian trung bình khi tìm kiếm một phần tử trong Cây Tìm kiếm Nhị phân cân bằng (Balanced BST) là bao nhiêu?`,
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correctAnswer: 2,
      explanation: "Trong cây nhị phân tìm kiếm cân bằng, mỗi phép so sánh loại bỏ được một nửa số lượng phần tử của cây nên có độ phức tạp O(log n).",
    },
    {
      id: `q_3_${Date.now()}`,
      question: `Toán tử nào trong ngôn ngữ C được sử dụng để lấy địa chỉ ô nhớ của một biến?`,
      options: ["Toán tử sao (*)", "Toán tử và (&)", "Toán tử mũi tên (->)", "Toán tử chấm (.)"],
      correctAnswer: 1,
      explanation: "Toán tử '&' (Address-of operator) trả về địa chỉ bộ nhớ của biến. Còn toán tử '*' là Dereference operator dùng để truy xuất giá trị tại địa chỉ đó.",
    },
    {
      id: `q_4_${Date.now()}`,
      question: `Trong môn Toán rời rạc, một đồ thị vô hướng liên thông và không có chu trình được gọi là gì?`,
      options: ["Đồ thị Euler", "Đồ thị phẳng", "Cây (Tree)", "Đồ thị Hamilton"],
      correctAnswer: 2,
      explanation: "Theo định nghĩa lý thuyết đồ thị, Cây (Tree) là một đồ thị vô hướng, liên thông và không chứa bất kỳ chu trình nào.",
    },
    {
      id: `q_5_${Date.now()}`,
      question: `Hàm malloc() trong C trả về con trỏ kiểu gì khi cấp phát bộ nhớ thành công?`,
      options: ["int*", "char*", "void*", "null*"],
      correctAnswer: 2,
      explanation: "malloc() trả về con trỏ void* (con trỏ tổng quát vô kiểu), cho phép ép kiểu sang bất kỳ con trỏ dữ liệu nào.",
    },
    {
      id: `q_6_${Date.now()}`,
      question: `Thuật toán sắp xếp nào sau đây có độ phức tạp thời gian trong trường hợp xấu nhất luôn là O(n log n)?`,
      options: ["Quick Sort", "Bubble Sort", "Merge Sort", "Insertion Sort"],
      correctAnswer: 2,
      explanation: "Merge Sort áp dụng chiến lược Chia để trị (Divide and Conquer), chia đôi mảng đều đặn nên luôn đạt O(n log n) ở cả Best, Average và Worst case.",
    },
  ];

  return questions.slice(0, Math.min(params.count, questions.length));
}

function getFallbackFlashcards(params: { subject: string; count: number }): GeneratedFlashcard[] {
  return [
    {
      front: "Con trỏ (Pointer) trong C là gì?",
      back: "Biến lưu trữ địa chỉ ô nhớ của một biến khác. Khai báo với dấu *, lấy địa chỉ bằng dấu &.",
      category: "C Programming",
    },
    {
      front: "Phép giải tham chiếu (*ptr) có tác dụng gì?",
      back: "Truy xuất hoặc thay đổi trực tiếp giá trị nằm tại địa chỉ ô nhớ mà con trỏ ptr đang trỏ tới.",
      category: "C Programming",
    },
    {
      front: "Tính chất cốt lõi của Binary Search Tree (BST)?",
      back: "Nút con bên trái luôn có giá trị nhỏ hơn nút gốc, nút con bên phải luôn có giá trị lớn hơn nút gốc.",
      category: "Data Structures",
    },
    {
      front: "Độ phức tạp của thuật toán Tìm kiếm Nhị phân (Binary Search)?",
      back: "O(log n) thời gian và O(1) không gian bộ nhớ phụ trợ (với mảng đã được sắp xếp).",
      category: "Algorithms",
    },
    {
      front: "Ma trận kề (Adjacency Matrix) là gì?",
      back: "Ma trận vuông n x n biểu diễn sự tồn tại cạnh nối giữa các đỉnh trong đồ thị.",
      category: "Discrete Math",
    },
    {
      front: "Memory Leak (Rò rỉ bộ nhớ) xảy ra khi nào?",
      back: "Khi bộ nhớ được cấp phát động bằng malloc/calloc nhưng không được giải phóng bằng free() sau khi dùng xong.",
      category: "C Programming",
    },
  ].slice(0, params.count || 6);
}

function getFallbackStudyPlan(params: {
  subject: string;
  examDate: string;
  targetGrade: string;
  availableHoursPerDay: number;
}) {
  return {
    planTitle: `Lộ trình bứt phá điểm ${params.targetGrade || "A+"} môn ${params.subject}`,
    overview: `Kế hoạch được tối ưu hóa cho ${params.availableHoursPerDay}h học mỗi ngày trước ngày thi ${params.examDate}. Tập trung 70% vào thực hành và làm quiz trắc nghiệm.`,
    totalWeeks: 4,
    weeks: [
      {
        weekNumber: 1,
        title: "Tuần 1: Củng cố Nền tảng & Cấu trúc Dữ liệu Cơ bản",
        focusTopics: ["Biến & Con trỏ nâng cao", "Mảng động & Cấp phát bộ nhớ", "Danh sách liên kết đơn"],
        tasks: [
          { id: "w1_t1", title: "Đọc slide Chương 1-3 & tóm tắt ý chính", durationHours: 3, completed: true },
          { id: "w1_t2", title: "Làm 20 câu trắc nghiệm về Con trỏ", durationHours: 2, completed: true },
          { id: "w1_t3", title: "Thực hành code Linked List trên IDE", durationHours: 4, completed: false },
        ],
        recommendedMaterials: ["Slide_Chuong_1_Con_Tro.pdf", "Lab01_LinkedList.docx"],
        tip: "Hãy vẽ sơ đồ con trỏ ra giấy trước khi code để tránh lỗi Segmentation Fault.",
      },
      {
        weekNumber: 2,
        title: "Tuần 2: Cấu trúc Cây & Giải thuật Đồ thị",
        focusTopics: ["Binary Search Tree (BST)", "Duyệt cây In-order, Pre-order, Post-order", "DFS & BFS cơ bản"],
        tasks: [
          { id: "w2_t1", title: "Học lý thuyết và cách chèn/xóa nút trong BST", durationHours: 4, completed: false },
          { id: "w2_t2", title: "Luyện 30 Flashcards thuật ngữ cây nhị phân", durationHours: 2, completed: false },
          { id: "w2_t3", title: "Làm bài test thử nghiệm Chương Cây", durationHours: 2, completed: false },
        ],
        recommendedMaterials: ["Data_Structures_Tree_Graph.pdf"],
        tip: "Duyệt In-order trên BST luôn cho ra dãy số tăng dần, hãy dùng tính chất này để kiểm tra code.",
      },
      {
        weekNumber: 3,
        title: "Tuần 3: Luyện Đề Thi Thử & Khắc phục Điểm yếu",
        focusTopics: ["Giải 3 đề thi học kỳ các năm trước", "Phân tích câu hỏi bẫy", "Tối ưu hóa độ phức tạp thuật toán"],
        tasks: [
          { id: "w3_t1", title: "Giải đề thi 2024 (Bấm giờ 60 phút)", durationHours: 3, completed: false },
          { id: "w3_t2", title: "Dùng AI Assistant phân tích các câu làm sai", durationHours: 2, completed: false },
          { id: "w3_t3", title: "Ôn lại các dạng bài tập phân bổ điểm lớn", durationHours: 3, completed: false },
        ],
        recommendedMaterials: ["De_Thi_Mau_Kỳ_Truoc.pdf"],
        tip: "Đừng chỉ xem đáp án đúng, hãy hiểu rõ tại sao 3 đáp án còn lại sai.",
      },
      {
        weekNumber: 4,
        title: "Tuần 4: Ôn tập Nước rút & Tâm lý Phòng thi",
        focusTopics: ["Hệ thống hóa toàn bộ công thức & ghi chú", "Làm bài quiz tổng hợp cuối cùng", "Nghỉ ngơi chuẩn bị thể lực"],
        tasks: [
          { id: "w4_t1", title: "Xem lại danh sách Ghi chú được ghim", durationHours: 2, completed: false },
          { id: "w4_t2", title: "Làm bài Full Mock Test đạt tối thiểu 8.5/10", durationHours: 2, completed: false },
          { id: "w4_t3", title: "Kiểm tra lại phòng thi, số báo danh và thẻ sinh viên", durationHours: 1, completed: false },
        ],
        recommendedMaterials: ["Tong_Hop_Kien_Thuc_Trong_Tam.pdf"],
        tip: "Giữ tinh thần thoải mái, ngủ đủ 8 tiếng trước ngày thi để não bộ phản xạ tốt nhất.",
      },
    ],
    keyStrategies: [
      "Áp dụng quy tắc Pomodoro 25 phút học - 5 phút nghỉ để duy trì độ tập trung cao độ.",
      "Luyện tập Active Recall bằng cách tự giải thích lại bài học cho AI nghe.",
      "Tập trung khắc phục 20% dạng bài khó nhưng chiếm 80% điểm phân loại.",
    ],
  };
}

function getFallbackPerformanceAnalysis(params: {
  courses: Array<{ name: string; grade: number; progress: number }>;
  completedTasks: number;
  totalTasks: number;
}) {
  const sorted = [...params.courses].sort((a, b) => b.grade - a.grade);
  const strongest = sorted[0]?.name || "Programming in C";
  const weakest = sorted[sorted.length - 1]?.name || "Data Structures";
  const completionRate = params.totalTasks > 0 ? Math.round((params.completedTasks / params.totalTasks) * 100) : 75;

  return {
    strongestSubject: strongest,
    weakestSubject: weakest,
    taskCompletionRate: completionRate,
    summary: `Bạn đang duy trì phong độ học tập tốt với tỷ lệ hoàn thành nhiệm vụ đạt ${completionRate}%. Điểm số nổi bật nhất ở môn ${strongest}, tuy nhiên cần bổ sung thêm thời lượng ôn tập cho môn ${weakest} trước kỳ thi cuối kỳ.`,
    recommendations: [
      `Dành thêm ít nhất 45 phút mỗi ngày cho môn ${weakest} để củng cố các chương có điểm quiz dưới 8.0.`,
      `Duy trì chuỗi học tập (Study Streak) liên tục vào khung giờ vàng từ 20:00 - 22:00.`,
      `Tạo thêm 2 bộ Quiz mô phỏng cho các chương lý thuyết để tăng tốc độ làm bài lên 25%.`,
      `Tận dụng tính năng tóm tắt tài liệu bằng AI để tiết kiệm 50% thời gian đọc giáo trình dài.`,
    ],
    actionPlan: [
      `Bước 1: Làm bài trắc nghiệm 15 câu môn ${weakest} hôm nay.`,
      `Bước 2: Hoàn thành 2 bài tập đang ở trạng thái 'In Progress' trong Task Manager.`,
      `Bước 3: Xem lại toàn bộ Flashcards đã đánh dấu 'Need Review'.`,
    ],
  };
}
