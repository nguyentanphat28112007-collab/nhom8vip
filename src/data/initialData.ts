import {
  User,
  Course,
  DocumentItem,
  NoteItem,
  TaskItem,
  ScheduleEvent,
  CourseGradeData,
  FlashcardDeck,
  StudyPlan,
  NotificationItem,
  AIConversation,
  QuizAttempt,
} from '../types';

export const initialUser: User = {
  id: 'user_default',
  name: 'Nguyễn Tấn Phát',
  email: 'nguyentanphat28112007@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  university: 'Đại học Quốc gia TP.HCM',
  major: 'Khoa học Máy tính (Computer Science)',
  year: 'Năm 2 (Sophomore)',
  studyGoals: 'Đạt GPA 3.8/4.0, thành thạo Cấu trúc Dữ liệu & Giải thuật và hoàn thành đề tài NCKH.',
  gpaTarget: 3.8,
  streakDays: 14,
  totalStudyHours: 86.5,
  lastActiveDate: '2026-08-17',
  language: 'vi',
  darkMode: true,
};

export const initialCourses: Course[] = [
  {
    id: 'course_c_prog',
    code: 'CSC101',
    name: 'Lập trình C (Programming in C)',
    lecturer: 'TS. Trần Văn Nam',
    room: 'B2.04 - CS1',
    credits: 3,
    color: '#3b82f6', // blue
    description: 'Nền tảng kỹ thuật lập trình, quản lý bộ nhớ, con trỏ, cấu trúc dữ liệu cơ bản và lập trình hướng thủ tục trong C.',
    progress: 88,
    averageGrade: 8.8,
    term: 'Học kỳ 1 (2026-2027)',
  },
  {
    id: 'course_dsa',
    code: 'CSC201',
    name: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    lecturer: 'PGS. TS. Lê Hoàng Minh',
    room: 'A1.102 - CS1',
    credits: 4,
    color: '#8b5cf6', // purple
    description: 'Nghiên cứu các cấu trúc dữ liệu trừu tượng: Linked List, Stack, Queue, Tree, Graph, thuật toán tìm kiếm và sắp xếp nâng cao.',
    progress: 68,
    averageGrade: 7.8,
    term: 'Học kỳ 1 (2026-2027)',
  },
  {
    id: 'course_discrete_math',
    code: 'MTH104',
    name: 'Toán Rời rạc (Discrete Mathematics)',
    lecturer: 'TS. Nguyễn Thị Mai',
    room: 'C3.08 - CS2',
    credits: 3,
    color: '#10b981', // emerald
    description: 'Logic mệnh đề, tập hợp, quan hệ, lý thuyết đồ thị, đại số Boole và bài toán đếm tổ hợp ứng dụng trong tin học.',
    progress: 75,
    averageGrade: 8.2,
    term: 'Học kỳ 1 (2026-2027)',
  },
  {
    id: 'course_psychology',
    code: 'EDU102',
    name: 'Tâm lý học Giáo dục (Educational Psychology)',
    lecturer: 'ThS. Phạm Thu Trang',
    room: 'D1.205 - CS1',
    credits: 2,
    color: '#f59e0b', // amber
    description: 'Các quy luật tâm lý trong nhận thức, động lực học tập, tâm lý lứa tuổi và phương pháp tư duy tích cực.',
    progress: 90,
    averageGrade: 8.9,
    term: 'Học kỳ 1 (2026-2027)',
  },
];

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc_1',
    title: 'GiaoTrinh_LapTrinh_C_ConTro_BoNho.pdf',
    courseId: 'course_c_prog',
    courseName: 'Lập trình C (Programming in C)',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-08-10',
    tags: ['Pointer', 'Memory', 'Malloc', 'C'],
    isFavorite: true,
    content: `# CHƯƠNG 5: CON TRỎ VÀ QUẢN LÝ BỘ NHỚ TRONG C

1. KHÁI NIỆM CON TRỎ (POINTER)
Con trỏ là một biến đặc biệt dùng để lưu trữ địa chỉ ô nhớ của một biến khác.
Cú pháp khai báo:
    <Kiểu dữ liệu> *<Tên biến con trỏ>;
Ví dụ:
    int a = 20;
    int *p = &a; // Toán tử & trả về địa chỉ ô nhớ của a

2. TOÁN TỬ VỚI CON TRỎ
- Toán tử &: Lấy địa chỉ của biến
- Toán tử *: Giải tham chiếu (Dereference) - lấy hoặc thay đổi giá trị tại vùng nhớ con trỏ trỏ tới.
    *p = 50; // Lúc này giá trị của biến a cũng đổi thành 50

3. CẤP PHÁT BỘ NHỚ ĐỘNG (DYNAMIC MEMORY ALLOCATION)
Các hàm trong thư viện <stdlib.h>:
- malloc(size): Cấp phát khối bộ nhớ chưa khởi tạo
- calloc(num, size): Cấp phát và khởi tạo toàn bộ byte về 0
- realloc(ptr, new_size): Thay đổi kích thước khối bộ nhớ
- free(ptr): Giải phóng vùng nhớ đã cấp phát động (tránh Memory Leak).

4. CON TRỎ VÀ MẢNG
Tên của mảng thực chất là một con trỏ hằng trỏ đến phần tử đầu tiên arr == &arr[0].
Phép toán số học con trỏ: *(arr + i) tương đương với arr[i].`,
    summary: 'Tài liệu hệ thống hóa toàn diện lý thuyết con trỏ trong C: bản chất địa chỉ ô nhớ, toán tử & và *, cấp phát động qua malloc/calloc/free, và mối quan hệ chặt chẽ giữa con trỏ và mảng.',
    keyPoints: [
      'Con trỏ lưu trữ địa chỉ vùng nhớ RAM thay vì giá trị thực.',
      'Toán tử * dùng để truy xuất giá trị tại địa chỉ đó (Dereferencing).',
      'Luôn giải phóng bộ nhớ động bằng free(ptr) sau khi dùng để tránh Memory Leak.',
      'Tên mảng là một con trỏ hằng trỏ tới phần tử thứ 0 của mảng.',
    ],
  },
  {
    id: 'doc_2',
    title: 'Cay_Nhi_Phan_Va_Cay_Tim_Kiem_BST.pdf',
    courseId: 'course_dsa',
    courseName: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    fileType: 'pdf',
    fileSize: '3.8 MB',
    uploadDate: '2026-08-12',
    tags: ['BST', 'Tree', 'Recursion', 'DSA'],
    isFavorite: true,
    content: `# CHƯƠNG 4: CÂY NHỊ PHÂN VÀ CÂY TÌM KIẾM NHỊ PHÂN (BINARY SEARCH TREE)

1. ĐỊNH NGHĨA CÂY NHỊ PHÂN (BINARY TREE)
Cây nhị phân là một tập hợp rỗng hoặc gồm một nút gốc (Root) và hai cây nhị phân con rời nhau được gọi là cây con trái (Left Subtree) và cây con phải (Right Subtree).

2. CÂY TÌM KIẾM NHỊ PHÂN (BINARY SEARCH TREE - BST)
Là cây nhị phân có thêm ràng buộc:
- Mọi nút trên cây con trái có giá trị khóa NHỎ HƠN khóa của nút gốc.
- Mọi nút trên cây con phải có giá trị khóa LỚN HƠN khóa của nút gốc.
- Cả hai cây con trái và phải đều là các cây tìm kiếm nhị phân.

3. ĐỘ PHỨC TẠP THỜI GIAN
- Tìm kiếm (Search): Trung bình O(log n), trường hợp xấu nhất O(n) khi cây suy biến thành danh sách liên kết.
- Thêm phần tử (Insert): O(log n) trung bình, O(n) xấu nhất.
- Xóa phần tử (Delete): O(log n) trung bình, O(n) xấu nhất. Có 3 trường hợp: nút lá, nút có 1 con, nút có 2 con (thay thế bằng nút nhỏ nhất cây con phải hoặc lớn nhất cây con trái).

4. CÁC PHƯƠNG PHÁP DUYỆT CÂY (TREE TRAVERSAL)
- Duyệt tiền thứ tự (Pre-order): Node -> Left -> Right
- Duyệt trung thứ tự (In-order): Left -> Node -> Right (Luôn sinh ra dãy khóa tăng dần trên BST!)
- Duyệt hậu thứ tự (Post-order): Left -> Right -> Node (Phù hợp khi xóa cây giải phóng bộ nhớ).`,
    summary: 'Tài liệu hướng dẫn chuyên sâu về cấu trúc Binary Search Tree (BST), các quy tắc tổ chức nút trái < gốc < phải, thuật toán tìm kiếm, chèn, xóa và 3 phương pháp duyệt cây kinh điển.',
    keyPoints: [
      'BST duy trì thứ tự khóa giúp việc tìm kiếm đạt O(log n) trung bình.',
      'Duyệt In-order trên BST luôn trả về một dãy số có thứ tự tăng dần.',
      'Xóa nút có 2 con cần tìm phần tử kế vị (In-order Successor) để thay thế an toàn.',
    ],
  },
  {
    id: 'doc_3',
    title: 'Ly_Thuyet_Do_Thi_Toan_Roi_Rac.docx',
    courseId: 'course_discrete_math',
    courseName: 'Toán Rời rạc (Discrete Mathematics)',
    fileType: 'docx',
    fileSize: '1.9 MB',
    uploadDate: '2026-08-14',
    tags: ['Graph', 'Euler', 'Hamilton', 'Math'],
    isFavorite: false,
    content: `# CHUYÊN ĐỀ: LÝ THUYẾT ĐỒ THỊ VÀ ỨNG DỤNG

1. KHÁI NIỆM ĐỒ THỊ G = (V, E)
V là tập các đỉnh (Vertices), E là tập các cạnh (Edges) nối các cặp đỉnh.
- Đồ thị vô hướng: Cạnh không có hướng (u, v) = (v, u)
- Đồ thị có hướng (Digraph): Cạnh có hướng (u, v) != (v, u)

2. BẬC CỦA ĐỈNH (DEGREE)
- Trong đồ thị vô hướng: Bậc deg(v) là số cạnh gắn với đỉnh v.
- Định lý Bắt tay (Handshaking Lemma): Tổng bậc của tất cả các đỉnh bằng 2 lần số cạnh: SUM(deg(v)) = 2|E|.
- Hệ quả: Số đỉnh bậc lẻ trong đồ thị vô hướng luôn là một số chẵn.

3. ĐƯỜNG ĐI EULER VÀ CHU TRÌNH EULER
- Chu trình Euler: Đi qua mỗi CẠNH đúng một lần và quay về đỉnh xuất phát. Đồ thị liên thông có chu trình Euler khi và chỉ khi mọi đỉnh đều có bậc chẵn.
- Đường đi Euler: Đi qua mỗi cạnh đúng 1 lần. Tồn tại khi đồ thị có đúng 0 hoặc 2 đỉnh bậc lẻ.

4. CÂY (TREE) TRONG LÝ THUYẾT ĐỒ THỊ
Đồ thị vô hướng T = (V, E) là cây nếu và chỉ nếu:
- T liên thông và không có chu trình.
- T có đúng n đỉnh và (n - 1) cạnh.
- Giữa 2 đỉnh bất kỳ tồn tại duy nhất một đường đi đơn.`,
    summary: 'Tổng hợp các định lý then chốt về Lý thuyết Đồ thị: Định lý bắt tay, điều kiện tồn tại chu trình Euler, đồ thị phẳng và đặc tính cây n đỉnh n-1 cạnh.',
    keyPoints: [
      'Tổng bậc các đỉnh luôn bằng 2 lần số cạnh (Định lý bắt tay).',
      'Đồ thị liên thông có chu trình Euler khi tất cả các đỉnh đều có bậc chẵn.',
      'Cây là đồ thị liên thông không chu trình, có đúng n đỉnh và n - 1 cạnh.',
    ],
  },
  {
    id: 'doc_4',
    title: 'Tam_Ly_Hoc_Nhan_Thuc_Va_Dong_Luc.pptx',
    courseId: 'course_psychology',
    courseName: 'Tâm lý học Giáo dục (Educational Psychology)',
    fileType: 'pptx',
    fileSize: '4.1 MB',
    uploadDate: '2026-08-15',
    tags: ['Psychology', 'Cognition', 'Motivation'],
    isFavorite: false,
    content: `# BÀI GIẢNG: TÂM LÝ HỌC NHẬN THỨC VÀ PHƯƠNG PHÁP HỌC TẬP TỐI ƯU

1. THUYẾT TẢI NHẬN THỨC (COGNITIVE LOAD THEORY - Sweller)
Não bộ con người có 2 hệ thống trí nhớ:
- Trí nhớ làm việc (Working Memory): Dung lượng cực kỳ giới hạn (khoảng 4-7 thông tin tại một thời điểm).
- Trí nhớ dài hạn (Long-term Memory): Dung lượng gần như vô hạn.

2. CÁC LOẠI TẢI NHẬN THỨC:
- Tải nội tại (Intrinsic load): Độ khó tự nhiên của kiến thức.
- Tải ngoại lai (Extraneous load): Tải thừa do cách trình bày kém hoặc môi trường xao nhãng.
- Tải hữu ích (Germane load): Năng lượng não dành để liên kết kiến thức mới vào sơ đồ nhận thức (Schema).

3. ĐỘNG LỰC HỌC TẬP TỰ THÂN (INTRINSIC MOTIVATION - Deci & Ryan)
Tam giác quyết định động lực:
- Quyền tự chủ (Autonomy): Tự kiểm soát thời gian biểu và mục tiêu.
- Cảm giác thành thạo (Competence): Thấy mình ngày càng giỏi hơn qua các cột mốc nhỏ.
- Mối liên hệ (Relatedness): Được hỗ trợ và kết nối với cộng đồng.`,
    summary: 'Phân tích cơ chế hoạt động của não bộ trong học tập: Thuyết tải nhận thức của John Sweller và 3 yếu tố cốt lõi nuôi dưỡng động lực học tập tự thân.',
    keyPoints: [
      'Bộ nhớ ngắn hạn có giới hạn (4-7 mẩu tin), cần tránh đa nhiệm và tải ngoại lai.',
      'Động lực bền vững đến từ Quyền tự chủ, Năng lực thành thạo và Mối liên kết xã hội.',
    ],
  },
];

export const initialNotes: NoteItem[] = [
  {
    id: 'note_1',
    title: 'Tóm tắt kỹ thuật Con trỏ & Cấp phát động',
    courseId: 'course_c_prog',
    courseName: 'Lập trình C (Programming in C)',
    tags: ['#pointer', '#c', '#exam', '#malloc'],
    isPinned: true,
    createdAt: '2026-08-11T14:30:00Z',
    updatedAt: '2026-08-16T10:15:00Z',
    color: '#1e293b',
    content: `### Các lỗi kinh điển cần tránh khi làm bài thi Con trỏ C:

1. **Dangling Pointer (Con trỏ lơ lửng):**
   Con trỏ trỏ tới vùng nhớ đã bị \`free()\` hoặc vùng nhớ cục bộ trong hàm đã kết thúc.
   *Khắc phục:* Gán \`ptr = NULL;\` ngay sau khi \`free(ptr);\`.

2. **Memory Leak (Rò rỉ bộ nhớ):**
   Dùng \`malloc()\` cấp phát nhưng quên \`free()\`, hoặc ghi đè địa chỉ con trỏ trước khi giải phóng vùng cũ.

3. **Cú pháp ép kiểu void*:**
   \`\`\`c
   int *arr = (int*)malloc(n * sizeof(int));
   if (arr == NULL) {
       printf("Khong du bo nho!");
       exit(1);
   }
   \`\`\`

📌 *Mẹo:* Điểm thi thực hành rất hay bắt lỗi kiểm tra \`NULL\` sau khi \`malloc\`.`,
  },
  {
    id: 'note_2',
    title: 'Quy tắc cân bằng Cây Tìm Kiếm Nhị Phân (BST)',
    courseId: 'course_dsa',
    courseName: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    tags: ['#tree', '#bst', '#dsa', '#traversal'],
    isPinned: true,
    createdAt: '2026-08-13T09:00:00Z',
    updatedAt: '2026-08-15T16:20:00Z',
    color: '#1e293b',
    content: `### 3 Cách Duyệt Cây BST Cần Nhớ Nằm Lòng:

* **In-order (L-N-R):** Duyệt cây con trái -> Thăm gốc -> Duyệt cây con phải.
  => Kết quả thu được: **DÃY SỐ TĂNG DẦN**.
* **Pre-order (N-L-R):** Thăm gốc -> Duyệt trái -> Duyệt phải.
  => Ứng dụng: Sao chép cây nhị phân hoặc tạo biểu thức Prefix.
* **Post-order (L-R-N):** Duyệt trái -> Duyệt phải -> Thăm gốc.
  => Ứng dụng: Xóa cây (giải phóng con trước khi giải phóng cha).

\`\`\`
          50
        /    \\
      30      70
     /  \\    /  \\
    20  40  60  80
\`\`\`
- In-order: 20, 30, 40, 50, 60, 70, 80
- Pre-order: 50, 30, 20, 40, 70, 60, 80
- Post-order: 20, 40, 30, 60, 80, 70, 50`,
  },
  {
    id: 'note_3',
    title: 'Bí kíp chứng minh đồ thị Euler trong Toán Rời Rạc',
    courseId: 'course_discrete_math',
    courseName: 'Toán Rời rạc (Discrete Mathematics)',
    tags: ['#euler', '#graph', '#math'],
    isPinned: false,
    createdAt: '2026-08-14T20:00:00Z',
    updatedAt: '2026-08-14T20:00:00Z',
    color: '#1e293b',
    content: `1. **Chu trình Euler:** Đồ thị liên thông + Tất cả các đỉnh đều có bậc chẵn.
2. **Đường đi Euler:** Đồ thị liên thông + Có đúng 2 đỉnh bậc lẻ (Đường đi sẽ bắt đầu từ 1 đỉnh lẻ và kết thúc tại đỉnh lẻ còn lại).
3. **Thuật toán Fleury:** Đi theo các cạnh tùy ý, chỉ qua cầu (bridge) khi không còn lựa chọn nào khác.`,
  },
];

export const initialTasks: TaskItem[] = [
  {
    id: 'task_1',
    title: 'Hoàn thành bài tập lớn Lập trình C (Quản lý sinh viên)',
    description: 'Viết chương trình C quản lý danh sách sinh viên bằng Danh sách liên kết đơn và lưu file nhị phân.',
    courseId: 'course_c_prog',
    courseName: 'Lập trình C (Programming in C)',
    priority: 'High',
    status: 'In Progress',
    deadline: '2026-08-22',
    estimatedHours: 6,
  },
  {
    id: 'task_2',
    title: 'Ôn tập Chương 4 Cây Nhị Phân & BST',
    description: 'Đọc lại tài liệu slide, làm 15 câu trắc nghiệm và code lại hàm xóa nút trong cây BST.',
    courseId: 'course_dsa',
    courseName: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    priority: 'High',
    status: 'To Do',
    deadline: '2026-08-20',
    estimatedHours: 4,
  },
  {
    id: 'task_3',
    title: 'Chuẩn bị Slide thuyết trình Tâm lý học Giáo dục',
    description: 'Thuyết trình nhóm về Thuyết Tải Nhận Thức (Cognitive Load Theory) trong dạy học trực tuyến.',
    courseId: 'course_psychology',
    courseName: 'Tâm lý học Giáo dục (Educational Psychology)',
    priority: 'Medium',
    status: 'In Progress',
    deadline: '2026-08-25',
    estimatedHours: 3,
  },
  {
    id: 'task_4',
    title: 'Giải bài tập Đồ thị Euler & Hamilton trong Toán rời rạc',
    description: 'Làm bài tập mục 4.2 và 4.3 trong sách bài tập của TS. Nguyễn Thị Mai.',
    courseId: 'course_discrete_math',
    courseName: 'Toán Rời rạc (Discrete Mathematics)',
    priority: 'Medium',
    status: 'To Do',
    deadline: '2026-08-24',
    estimatedHours: 3,
  },
  {
    id: 'task_5',
    title: 'Đọc trước tài liệu Cấu trúc dữ liệu Đồ thị (Graph DFS/BFS)',
    description: 'Chuẩn bị bài trước khi lên giảng đường vào thứ 4 tới.',
    courseId: 'course_dsa',
    courseName: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    priority: 'Low',
    status: 'To Do',
    deadline: '2026-08-28',
    estimatedHours: 2,
  },
  {
    id: 'task_6',
    title: 'Nộp báo cáo thực hành Lab 03 - Con trỏ & Cấp phát động',
    description: 'Đã hoàn thành và kiểm tra memory leak bằng Valgrind.',
    courseId: 'course_c_prog',
    courseName: 'Lập trình C (Programming in C)',
    priority: 'High',
    status: 'Completed',
    deadline: '2026-08-16',
    estimatedHours: 4,
  },
];

export const initialScheduleEvents: ScheduleEvent[] = [
  {
    id: 'evt_1',
    title: 'Học lý thuyết Lập trình C',
    type: 'class',
    courseId: 'course_c_prog',
    courseName: 'Lập trình C (Programming in C)',
    date: '2026-08-17',
    startTime: '08:00',
    endTime: '11:15',
    location: 'Phòng B2.04',
    notes: 'Chương Con trỏ hàm và Quản lý file',
  },
  {
    id: 'evt_2',
    title: 'Luyện đề trắc nghiệm DSA trên AI Study Assistant',
    type: 'study_session',
    courseId: 'course_dsa',
    courseName: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    date: '2026-08-17',
    startTime: '14:30',
    endTime: '16:30',
    location: 'Thư viện trung tâm',
    notes: 'Luyện 20 câu trắc nghiệm chủ đề Tree & BST',
  },
  {
    id: 'evt_3',
    title: 'Học Toán Rời Rạc',
    type: 'class',
    courseId: 'course_discrete_math',
    courseName: 'Toán Rời rạc (Discrete Mathematics)',
    date: '2026-08-18',
    startTime: '09:30',
    endTime: '11:45',
    location: 'Phòng C3.08',
    notes: 'Lý thuyết Đồ thị Euler & Định lý Bắt tay',
  },
  {
    id: 'evt_4',
    title: 'Học Tâm lý học Giáo dục',
    type: 'class',
    courseId: 'course_psychology',
    courseName: 'Tâm lý học Giáo dục (Educational Psychology)',
    date: '2026-08-19',
    startTime: '13:30',
    endTime: '15:45',
    location: 'Phòng D1.205',
    notes: 'Thảo luận nhóm thuyết tải nhận thức',
  },
  {
    id: 'evt_5',
    title: 'Thi Giữa kỳ Cấu trúc Dữ liệu & Giải thuật',
    type: 'exam',
    courseId: 'course_dsa',
    courseName: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    date: '2026-08-29',
    startTime: '08:30',
    endTime: '10:00',
    location: 'Hội trường A',
    notes: 'Trắc nghiệm 40 câu + 1 câu tự luận thuật toán',
  },
  {
    id: 'evt_6',
    title: 'Deadline Nộp Bài tập Lớn C',
    type: 'deadline',
    courseId: 'course_c_prog',
    courseName: 'Lập trình C (Programming in C)',
    date: '2026-08-22',
    startTime: '23:59',
    endTime: '23:59',
    location: 'Nộp trên Portal LMS',
    notes: 'Bao gồm source code .c và báo cáo pdf',
  },
];

export const initialCourseGrades: CourseGradeData[] = [
  {
    courseId: 'course_c_prog',
    courseName: 'Lập trình C (Programming in C)',
    credits: 3,
    components: [
      { id: 'c_att', name: 'Chuyên cần & Tham gia', weightPercent: 10, score: 9.5 },
      { id: 'c_lab', name: 'Bài tập Lab thực hành', weightPercent: 20, score: 9.0 },
      { id: 'c_mid', name: 'Thi Giữa kỳ', weightPercent: 30, score: 8.5 },
      { id: 'c_fin', name: 'Thi Cuối kỳ', weightPercent: 40, score: 8.8 },
    ],
  },
  {
    courseId: 'course_dsa',
    courseName: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    credits: 4,
    components: [
      { id: 'dsa_att', name: 'Chuyên cần', weightPercent: 10, score: 9.0 },
      { id: 'dsa_asg', name: 'Bài tập lớn / Assignment', weightPercent: 20, score: 7.5 },
      { id: 'dsa_mid', name: 'Thi Giữa kỳ', weightPercent: 30, score: 7.5 },
      { id: 'dsa_fin', name: 'Thi Cuối kỳ', weightPercent: 40, score: 8.0 },
    ],
  },
  {
    courseId: 'course_discrete_math',
    courseName: 'Toán Rời rạc (Discrete Mathematics)',
    credits: 3,
    components: [
      { id: 'dm_att', name: 'Chuyên cần', weightPercent: 10, score: 10.0 },
      { id: 'dm_quiz', name: 'Quiz hàng tuần', weightPercent: 20, score: 8.0 },
      { id: 'dm_mid', name: 'Thi Giữa kỳ', weightPercent: 30, score: 8.0 },
      { id: 'dm_fin', name: 'Thi Cuối kỳ', weightPercent: 40, score: 8.2 },
    ],
  },
  {
    courseId: 'course_psychology',
    courseName: 'Tâm lý học Giáo dục (Educational Psychology)',
    credits: 2,
    components: [
      { id: 'psy_att', name: 'Chuyên cần', weightPercent: 10, score: 10.0 },
      { id: 'psy_pre', name: 'Thuyết trình nhóm', weightPercent: 30, score: 9.0 },
      { id: 'psy_mid', name: 'Tiểu luận giữa kỳ', weightPercent: 20, score: 8.5 },
      { id: 'psy_fin', name: 'Thi Cuối kỳ', weightPercent: 40, score: 8.8 },
    ],
  },
];

export const initialFlashcardDecks: FlashcardDeck[] = [
  {
    id: 'deck_c',
    title: 'Bộ Thẻ Ôn Thi: Con Trỏ & Cấp Phát Bộ Nhớ C',
    courseId: 'course_c_prog',
    courseName: 'Lập trình C (Programming in C)',
    description: 'Các khái niệm sống còn về con trỏ, toán tử dereference, con trỏ hàm và cấp phát động.',
    createdAt: '2026-08-12',
    cards: [
      {
        id: 'fc_c_1',
        front: 'Con trỏ (Pointer) trong C là gì?',
        back: 'Là biến đặc biệt lưu địa chỉ ô nhớ của biến khác trong RAM thay vì lưu trực tiếp giá trị.',
        category: 'C Fundamentals',
        status: 'mastered',
      },
      {
        id: 'fc_c_2',
        front: 'Toán tử & và * trong con trỏ khác nhau thế nào?',
        back: '& là toán tử lấy địa chỉ (Address-of). * là toán tử giải tham chiếu (Dereference) để lấy hoặc sửa giá trị tại ô nhớ đó.',
        category: 'C Operators',
        status: 'mastered',
      },
      {
        id: 'fc_c_3',
        front: 'Hàm free(ptr) có tác dụng gì và cần lưu ý gì?',
        back: 'Giải phóng vùng nhớ heap đã cấp phát bằng malloc/calloc. Cần gán ptr = NULL ngay sau đó để tránh lỗi Dangling Pointer.',
        category: 'Memory Management',
        status: 'need_review',
      },
      {
        id: 'fc_c_4',
        front: 'Sự khác nhau giữa malloc() và calloc()?',
        back: 'malloc(size) cấp phát vùng nhớ nhưng KHÔNG khởi tạo giá trị (chứa rác). calloc(n, size) cấp phát và KHỞI TẠO toàn bộ byte về 0.',
        category: 'Memory Management',
        status: 'need_review',
      },
      {
        id: 'fc_c_5',
        front: 'Mối liên hệ giữa tên mảng arr và con trỏ?',
        back: 'Tên mảng là một con trỏ hằng trỏ đến phần tử arr[0]. Phép truy xuất arr[i] chính là *(arr + i).',
        category: 'Arrays & Pointers',
        status: 'unlearned',
      },
    ],
  },
  {
    id: 'deck_dsa',
    title: 'Bộ Thẻ Ôn Thi: Cấu Trúc Dữ Liệu Cây & Đồ Thị',
    courseId: 'course_dsa',
    courseName: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    description: 'Các tính chất cây nhị phân, BST, cây AVL và thuật toán duyệt BFS/DFS.',
    createdAt: '2026-08-14',
    cards: [
      {
        id: 'fc_dsa_1',
        front: 'Quy tắc bất biến của Cây Tìm Kiếm Nhị Phân (BST)?',
        back: 'Mọi nút con bên trái luôn có khóa nhỏ hơn nút gốc; mọi nút con bên phải luôn có khóa lớn hơn nút gốc.',
        category: 'BST Rules',
        status: 'mastered',
      },
      {
        id: 'fc_dsa_2',
        front: 'Thứ tự duyệt In-order (Left - Node - Right) trên BST cho kết quả gì?',
        back: 'Luôn cho ra danh sách các giá trị khóa được sắp xếp THEO THỨ TỰ TĂNG DẦN.',
        category: 'Tree Traversal',
        status: 'mastered',
      },
      {
        id: 'fc_dsa_3',
        front: 'Độ phức tạp khi tìm kiếm trên BST không cân bằng trong trường hợp xấu nhất?',
        back: 'O(n) khi cây bị thoái hóa thành một đường thẳng (tương tự như Linked List).',
        category: 'Complexity',
        status: 'need_review',
      },
      {
        id: 'fc_dsa_4',
        front: 'Queue sử dụng nguyên lý gì?',
        back: 'FIFO (First In, First Out) - Vào trước ra trước, giống như hàng đợi mua vé.',
        category: 'Linear Structures',
        status: 'mastered',
      },
    ],
  },
];

export const initialStudyPlans: StudyPlan[] = [
  {
    id: 'plan_dsa_midterm',
    title: 'Kế hoạch Ôn thi Giữa kỳ: Cấu trúc Dữ liệu & Giải thuật',
    subject: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    courseId: 'course_dsa',
    examDate: '2026-08-29',
    targetGrade: 'A (8.5+)',
    dailyHours: 2,
    totalWeeks: 4,
    createdAt: '2026-08-10',
    syncedToCalendar: true,
    weeks: [
      {
        weekNumber: 1,
        title: 'Tuần 1: Củng cố Nền tảng & Cấu trúc Dữ liệu Cơ bản',
        focusTopics: ['Biến & Con trỏ nâng cao', 'Mảng động & Cấp phát bộ nhớ', 'Danh sách liên kết đơn'],
        tasks: [
          { id: 'w1_t1', title: 'Đọc slide Chương 1-3 & tóm tắt ý chính', durationHours: 3, completed: true },
          { id: 'w1_t2', title: 'Làm 20 câu trắc nghiệm về Con trỏ', durationHours: 2, completed: true },
          { id: 'w1_t3', title: 'Thực hành code Linked List trên IDE', durationHours: 4, completed: true },
        ],
        recommendedMaterials: ['GiaoTrinh_LapTrinh_C_ConTro_BoNho.pdf'],
        tip: 'Hãy vẽ sơ đồ con trỏ ra giấy trước khi code để tránh lỗi Segmentation Fault.',
      },
      {
        weekNumber: 2,
        title: 'Tuần 2: Cấu trúc Cây & Giải thuật Đồ thị',
        focusTopics: ['Binary Search Tree (BST)', 'Duyệt cây In-order, Pre-order, Post-order', 'DFS & BFS cơ bản'],
        tasks: [
          { id: 'w2_t1', title: 'Học lý thuyết và cách chèn/xóa nút trong BST', durationHours: 4, completed: false },
          { id: 'w2_t2', title: 'Luyện 30 Flashcards thuật ngữ cây nhị phân', durationHours: 2, completed: false },
          { id: 'w2_t3', title: 'Làm bài test thử nghiệm Chương Cây', durationHours: 2, completed: false },
        ],
        recommendedMaterials: ['Cay_Nhi_Phan_Va_Cay_Tim_Kiem_BST.pdf'],
        tip: 'Duyệt In-order trên BST luôn cho ra dãy số tăng dần, hãy dùng tính chất này để kiểm tra code.',
      },
      {
        weekNumber: 3,
        title: 'Tuần 3: Luyện Đề Thi Thử & Khắc phục Điểm yếu',
        focusTopics: ['Giải 3 đề thi học kỳ các năm trước', 'Phân tích câu hỏi bẫy', 'Tối ưu hóa độ phức tạp thuật toán'],
        tasks: [
          { id: 'w3_t1', title: 'Giải đề thi 2024 (Bấm giờ 60 phút)', durationHours: 3, completed: false },
          { id: 'w3_t2', title: 'Dùng AI Assistant phân tích các câu làm sai', durationHours: 2, completed: false },
          { id: 'w3_t3', title: 'Ôn lại các dạng bài tập phân bổ điểm lớn', durationHours: 3, completed: false },
        ],
        recommendedMaterials: ['De_Thi_Mau_Kỳ_Truoc.pdf'],
        tip: 'Đừng chỉ xem đáp án đúng, hãy hiểu rõ tại sao 3 đáp án còn lại sai.',
      },
      {
        weekNumber: 4,
        title: 'Tuần 4: Ôn tập Nước rút & Tâm lý Phòng thi',
        focusTopics: ['Hệ thống hóa toàn bộ công thức & ghi chú', 'Làm bài quiz tổng hợp cuối cùng', 'Nghỉ ngơi chuẩn bị thể lực'],
        tasks: [
          { id: 'w4_t1', title: 'Xem lại danh sách Ghi chú được ghim', durationHours: 2, completed: false },
          { id: 'w4_t2', title: 'Làm bài Full Mock Test đạt tối thiểu 8.5/10', durationHours: 2, completed: false },
          { id: 'w4_t3', title: 'Kiểm tra lại phòng thi, số báo danh và thẻ sinh viên', durationHours: 1, completed: false },
        ],
        recommendedMaterials: ['Tong_Hop_Kien_Thuc_Trong_Tam.pdf'],
        tip: 'Giữ tinh thần thoải mái, ngủ đủ 8 tiếng trước ngày thi để não bộ phản xạ tốt nhất.',
      },
    ],
    keyStrategies: [
      'Áp dụng quy tắc Pomodoro 25 phút học - 5 phút nghỉ để duy trì độ tập trung cao độ.',
      'Luyện tập Active Recall bằng cách tự giải thích lại bài học cho AI nghe.',
      'Tập trung khắc phục 20% dạng bài khó nhưng chiếm 80% điểm phân loại.',
    ],
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Nhắc nhở Thi Giữa kỳ',
    message: 'Kỳ thi Giữa kỳ môn Cấu trúc Dữ liệu & Giải thuật sẽ diễn ra sau 12 ngày (29/08/2026).',
    type: 'exam',
    time: '10 phút trước',
    isRead: false,
    linkTab: 'calendar',
  },
  {
    id: 'notif_2',
    title: 'Gợi ý từ AI Study Assistant 🤖',
    message: 'Bạn nên dành thêm 30 phút ôn tập chương Cây Nhị Phân (BST) môn DSA để nâng điểm trung bình lên 8.5.',
    type: 'ai_recommendation',
    time: '2 giờ trước',
    isRead: false,
    linkTab: 'analytics',
  },
  {
    id: 'notif_3',
    title: 'Chuỗi học tập rực rỡ 🔥',
    message: 'Chúc mừng! Bạn đã duy trì chuỗi học tập 14 ngày liên tiếp. Hãy tiếp tục phát huy nhé!',
    type: 'streak',
    time: 'Hôm nay, 08:00',
    isRead: true,
    linkTab: 'dashboard',
  },
  {
    id: 'notif_4',
    title: 'Hạn chót Bài tập Lớn C',
    message: 'Deadline nộp Assignment Lập trình C vào ngày 22/08 (còn 5 ngày).',
    type: 'deadline',
    time: 'Hôm qua',
    isRead: true,
    linkTab: 'tasks',
  },
];

export const initialConversations: AIConversation[] = [
  {
    id: 'conv_1',
    title: 'Giải thích Con trỏ trong C cho người mới',
    courseId: 'course_c_prog',
    updatedAt: '2026-08-16T15:00:00Z',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Giải thích con trỏ trong C cho tôi như một sinh viên năm nhất với ví dụ dễ hiểu.',
        timestamp: '15:00',
      },
      {
        id: 'm2',
        role: 'assistant',
        content: `### 📌 Chào bạn! Con trỏ (Pointer) trong C thực ra rất thú vị và trực quan:

Hãy tưởng tượng trong phòng trọ của bạn có nhiều chiếc tủ có đánh số (đó là các **ô nhớ RAM**).

1. **Biến thông thường:** Bạn để một chú gấu bông vào tủ số 104. Giá trị của biến là "gấu bông", còn địa chỉ là "104".
2. **Biến con trỏ:** Là một mảnh giấy note ghi lại con số "104". Khi cần tìm gấu bông, bạn chỉ việc đọc mảnh giấy và đi tới tủ số 104!

#### 💻 Cú pháp trong code C:
\`\`\`c
int a = 100;     // Hộp thư chứa số 100
int *ptr = &a;   // ptr là tờ giấy ghi địa chỉ của hộp thư a

printf("Dia chi cua a: %p\\n", ptr);
printf("Gia tri tai dia chi do: %d\\n", *ptr); // In ra 100
\`\`\`

💡 **Toán tử cần nhớ:**
- \`&\`: "Lấy địa chỉ nhà của biến"
- \`*\`: "Đến địa chỉ đó để mở hộp lấy đồ"`,
        timestamp: '15:01',
      },
    ],
  },
  {
    id: 'conv_2',
    title: 'Tóm tắt Cây Tìm Kiếm Nhị Phân (BST)',
    courseId: 'course_dsa',
    updatedAt: '2026-08-15T11:20:00Z',
    messages: [
      {
        id: 'm3',
        role: 'user',
        content: 'Cho tôi biết tại sao duyệt In-order trên BST lại cho dãy số tăng dần?',
        timestamp: '11:20',
      },
      {
        id: 'm4',
        role: 'assistant',
        content: `### 🌳 Lý do duyệt In-order trên BST luôn tăng dần:

Trong Cây Tìm Kiếm Nhị Phân (BST), ta có nguyên tắc bất biến:
$$\\text{Cây con trái} < \\text{Nút gốc} < \\text{Cây con phải}$$

Thứ tự duyệt **In-order** (Trung thứ tự) được định nghĩa là:
1. Duyệt toàn bộ cây con **BÊN TRÁI** trước (gồm các phần tử nhỏ nhất).
2. Thăm **NÚT GỐC** (phần tử trung gian).
3. Duyệt toàn bộ cây con **BÊN PHẢI** sau cùng (gồm các phần tử lớn nhất).

Nhờ việc luôn đi từ nhánh nhỏ nhất (Trái) -> Trung gian (Gốc) -> Lớn nhất (Phải), kết quả in ra luôn là một **dãy số tăng dần hoàn hảo**! 🎯`,
        timestamp: '11:21',
      },
    ],
  },
];

export const initialQuizAttempts: QuizAttempt[] = [
  {
    id: 'attempt_1',
    title: 'Trắc nghiệm Cấu trúc Cây & BST',
    subject: 'Cấu trúc Dữ liệu & Giải thuật (DSA)',
    chapter: 'Chương 4: Tree & Binary Search Tree',
    difficulty: 'Medium',
    questionType: 'Multiple Choice',
    date: '2026-08-16 16:45',
    score: 8,
    totalQuestions: 10,
    correctCount: 8,
    wrongCount: 2,
    timeSpentSeconds: 420,
    aiFeedback: 'Rất xuất sắc! Bạn đã nắm vững các nguyên tắc cơ bản của BST và duyệt In-order. Cần lưu ý thêm về trường hợp xóa nút có 2 con.',
    questions: [
      {
        id: 'qa_1',
        question: 'Trong cấu trúc dữ liệu, cấu trúc nào tuân theo nguyên lý FIFO?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctAnswer: 1,
        userSelected: 1,
        explanation: 'Queue hoạt động theo nguyên tắc First-In First-Out (Vào trước ra trước).',
      },
      {
        id: 'qa_2',
        question: 'Độ phức tạp thời gian trung bình tìm kiếm trong Balanced BST?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctAnswer: 2,
        userSelected: 2,
        explanation: 'Mỗi bước so sánh loại bỏ 1/2 số nút còn lại nên đạt O(log n).',
      },
      {
        id: 'qa_3',
        question: 'Thứ tự duyệt In-order là gì?',
        options: ['Gốc - Trái - Phải', 'Trái - Gốc - Phải', 'Trái - Phải - Gốc', 'Gốc - Phải - Trái'],
        correctAnswer: 1,
        userSelected: 1,
        explanation: 'In-order duyệt Left -> Node -> Right.',
      },
      {
        id: 'qa_4',
        question: 'Trường hợp xấu nhất của BST không cân bằng có độ phức tạp tìm kiếm là?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        correctAnswer: 2,
        userSelected: 2,
        explanation: 'Khi suy biến thành mảng/danh sách liên kết, độ phức tạp là O(n).',
      },
    ],
  },
];
