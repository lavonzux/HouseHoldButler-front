# TypeScript 學習指南 - AI Housekeeper 專案

本文件整理了此專案中使用的 TypeScript 概念，幫助團隊成員學習 TypeScript。

---

## 目錄

1. [基礎型別](#1-基礎型別)
2. [介面與型別別名](#2-介面與型別別名)
3. [React 元件型別](#3-react-元件型別)
4. [泛型](#4-泛型)
5. [工具型別](#5-工具型別)
6. [型別守衛](#6-型別守衛)
7. [Ant Design 型別整合](#7-ant-design-型別整合)
8. [常見錯誤與解決方案](#8-常見錯誤與解決方案)

---

## 1. 基礎型別

### 原始型別 (Primitive Types)

```typescript
// 字串
const name: string = '全脂牛奶';

// 數字
const quantity: number = 2.5;

// 布林值
const isActive: boolean = true;

// null 和 undefined
const expiryDate: string | null = null;  // 可以是字串或 null
```

### 陣列

```typescript
// 兩種寫法都可以
const items: string[] = ['牛奶', '雞蛋'];
const items: Array<string> = ['牛奶', '雞蛋'];

// 物件陣列
const inventory: InventoryItem[] = [...];
```

### 聯合型別 (Union Types)

```typescript
// 只能是這三個值之一
type InventoryStatus = 'critical' | 'warning' | 'ok';

// 可以是多種型別
type StringOrNumber = string | number;
```

---

## 2. 介面與型別別名

### Interface（介面）

適合定義物件的結構，可以被擴展：

```typescript
// 基礎介面
interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
}

// 擴展介面
interface DetailedInventoryItem extends InventoryItem {
  description: string;
  tags: string[];
}

// 可選屬性用 ?
interface ConsumptionRecord {
  date: string;
  amount: number;
  note?: string;  // 可選
}

// 唯讀屬性用 readonly
interface Config {
  readonly apiUrl: string;
}
```

### Type（型別別名）

更靈活，可以定義聯合型別、元組等：

```typescript
// 聯合型別
type Status = 'active' | 'inactive' | 'pending';

// 元組
type Coordinate = [number, number];

// 函式型別
type ClickHandler = (event: React.MouseEvent) => void;

// 條件型別
type NonNullable<T> = T extends null | undefined ? never : T;
```

### Interface vs Type 選擇建議

| 場景 | 建議使用 |
|------|----------|
| 定義物件結構 | interface |
| 需要擴展 (extends) | interface |
| 聯合型別 | type |
| 元組 | type |
| 函式型別 | type |
| 複雜的型別運算 | type |

---

## 3. React 元件型別

### 函數元件

```typescript
// 方法 1: React.FC（包含 children）
const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectItem }) => {
  return <div>...</div>;
};

// 方法 2: 直接標註（推薦，更靈活）
function Dashboard({ onNavigate, onSelectItem }: DashboardProps): JSX.Element {
  return <div>...</div>;
}

// 方法 3: 箭頭函式直接標註
const Dashboard = ({ onNavigate, onSelectItem }: DashboardProps): JSX.Element => {
  return <div>...</div>;
};
```

### Props 型別定義

```typescript
interface DashboardProps {
  // 必要屬性
  onNavigate: (view: ViewName) => void;
  
  // 可選屬性
  title?: string;
  
  // 回呼函式
  onSelectItem: (item: InventoryItem) => void;
  
  // 子元素
  children?: React.ReactNode;
}
```

### 事件處理

```typescript
// 點擊事件
const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
  e.preventDefault();
};

// 輸入變更
const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  setSearch(e.target.value);
};

// 表單提交
const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  e.preventDefault();
};

// Ant Design Select 變更
const handleSelectChange = (value: string): void => {
  setCategory(value);
};
```

### useState

```typescript
// 自動推斷型別
const [count, setCount] = useState(0);  // number

// 明確指定型別
const [search, setSearch] = useState<string>('');

// 可能為 null 的狀態
const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

// 物件狀態
const [form, setForm] = useState<AddItemFormData>({
  name: '',
  category: '',
  quantity: null,
  unit: '個',
  location: '',
  expiryDate: null,
  consumptionRate: null,
});
```

### useCallback 和 useMemo

```typescript
// useCallback - 記憶化函式
const handleSelectItem = useCallback((item: InventoryItem): void => {
  setSelectedItem(item);
  setCurrentView('detail');
}, []);

// useMemo - 記憶化計算結果
const filteredData = useMemo((): InventoryItem[] => {
  return mockInventory.filter(item => item.name.includes(search));
}, [search]);

// 也可以用泛型明確指定
const criticalItems = useMemo<InventoryItem[]>(
  () => mockInventory.filter(item => item.status === 'critical'),
  []
);
```

---

## 4. 泛型

### 基礎泛型

```typescript
// 泛型函式
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstItem = getFirst(mockInventory);  // InventoryItem | undefined
const firstNumber = getFirst([1, 2, 3]);     // number | undefined

// 泛型介面
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const response: ApiResponse<InventoryItem[]> = {
  data: mockInventory,
  status: 200,
  message: 'Success',
};
```

### Ant Design 元件泛型

```typescript
// Table 泛型
import type { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<InventoryItem> = [
  {
    title: '名稱',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <span>{text}</span>,
  },
  {
    title: '數量',
    key: 'quantity',
    render: (_: unknown, record: InventoryItem) => 
      `${record.quantity} ${record.unit}`,
  },
];

<Table<InventoryItem>
  columns={columns}
  dataSource={filteredData}
  rowKey="id"
/>

// Form 泛型
const [form] = Form.useForm<AddItemFormData>();

<Form<AddItemFormData>
  form={form}
  onFinish={(values: AddItemFormData) => {
    console.log(values);
  }}
>
```

---

## 5. 工具型別

TypeScript 內建的工具型別可以幫助我們快速建立新型別：

```typescript
interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  status: InventoryStatus;
}

// Partial<T> - 所有屬性變成可選
type PartialItem = Partial<InventoryItem>;
// 等同於:
// { id?: number; name?: string; quantity?: number; ... }

// Required<T> - 所有屬性變成必要
type RequiredItem = Required<PartialItem>;

// Pick<T, K> - 選取部分屬性
type ItemSummary = Pick<InventoryItem, 'id' | 'name' | 'status'>;
// 等同於:
// { id: number; name: string; status: InventoryStatus; }

// Omit<T, K> - 排除部分屬性
type NewItem = Omit<InventoryItem, 'id'>;
// 用於新增時，id 由後端產生

// Record<K, T> - 建立鍵值對型別
type StatusConfig = Record<InventoryStatus, { label: string; color: string }>;
// 等同於:
// { critical: {...}; warning: {...}; ok: {...}; }

// Readonly<T> - 所有屬性變成唯讀
type ReadonlyItem = Readonly<InventoryItem>;

// Extract<T, U> - 從聯合型別中提取
type HighPriority = Extract<ReminderPriority, 'high' | 'medium'>;
// 結果: 'high' | 'medium'

// Exclude<T, U> - 從聯合型別中排除
type LowPriority = Exclude<ReminderPriority, 'high'>;
// 結果: 'medium' | 'low'

// NonNullable<T> - 排除 null 和 undefined
type DefiniteDate = NonNullable<string | null>;
// 結果: string
```

---

## 6. 型別守衛

### typeof 型別守衛

```typescript
function formatValue(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase();  // TypeScript 知道這裡 value 是 string
  }
  return value.toFixed(2);  // TypeScript 知道這裡 value 是 number
}
```

### null 檢查

```typescript
// 方法 1: if 檢查
if (selectedItem !== null) {
  console.log(selectedItem.name);  // TypeScript 知道不是 null
}

// 方法 2: 提早返回
if (selectedItem === null) {
  return null;
}
// 這之後 TypeScript 知道 selectedItem 不是 null
console.log(selectedItem.name);

// 方法 3: 可選鏈運算符 ?.
console.log(selectedItem?.name);  // 如果是 null 則為 undefined

// 方法 4: 空值合併運算符 ??
const displayName = selectedItem?.name ?? '未選擇';
```

### in 型別守衛

```typescript
interface PurchaseReminder {
  type: 'purchase';
  item: string;
  quantity: number;
}

interface ExpiryReminder {
  type: 'expiry';
  item: string;
  expiryDate: string;
}

type Reminder = PurchaseReminder | ExpiryReminder;

function handleReminder(reminder: Reminder) {
  if ('quantity' in reminder) {
    // TypeScript 知道這是 PurchaseReminder
    console.log(reminder.quantity);
  } else {
    // TypeScript 知道這是 ExpiryReminder
    console.log(reminder.expiryDate);
  }
}
```

### 判別式聯合 (Discriminated Union)

```typescript
// 使用 type 屬性作為判別式
type Reminder = 
  | { type: 'purchase'; item: string; quantity: number }
  | { type: 'expiry'; item: string; expiryDate: string }
  | { type: 'custom'; item: string; message: string };

function processReminder(reminder: Reminder) {
  switch (reminder.type) {
    case 'purchase':
      console.log(`需要購買 ${reminder.quantity} 個 ${reminder.item}`);
      break;
    case 'expiry':
      console.log(`${reminder.item} 將於 ${reminder.expiryDate} 過期`);
      break;
    case 'custom':
      console.log(reminder.message);
      break;
    default:
      // TypeScript 會檢查是否處理了所有情況
      const _exhaustiveCheck: never = reminder;
  }
}
```

---

## 7. Ant Design 型別整合

### 常用型別匯入

```typescript
import type { 
  TableProps, 
  ColumnsType 
} from 'antd/es/table';

import type { 
  FormInstance,
  FormProps 
} from 'antd/es/form';

import type { 
  MenuProps 
} from 'antd';

import type { 
  TimelineItemProps 
} from 'antd';
```

### Menu 項目型別

```typescript
type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '總覽' },
  { key: 'inventory', icon: <InboxOutlined />, label: '庫存清單' },
];
```

### Form 型別

```typescript
interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm<LoginFormData>();
  
  const onFinish = (values: LoginFormData) => {
    console.log(values.username, values.password);
  };

  return (
    <Form<LoginFormData> form={form} onFinish={onFinish}>
      <Form.Item<LoginFormData>
        name="username"
        rules={[{ required: true, message: '請輸入使用者名稱' }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};
```

---

## 8. 常見錯誤與解決方案

### 錯誤 1: Type 'X' is not assignable to type 'Y'

```typescript
// 錯誤
const status: InventoryStatus = 'danger';  // 'danger' 不在聯合型別中

// 解決：使用正確的值
const status: InventoryStatus = 'critical';
```

### 錯誤 2: Object is possibly 'null'

```typescript
// 錯誤
console.log(selectedItem.name);  // selectedItem 可能是 null

// 解決方案 1: null 檢查
if (selectedItem) {
  console.log(selectedItem.name);
}

// 解決方案 2: 可選鏈
console.log(selectedItem?.name);

// 解決方案 3: 非空斷言（確定不是 null 時使用）
console.log(selectedItem!.name);  // 謹慎使用！
```

### 錯誤 3: Property 'X' does not exist on type 'Y'

```typescript
// 錯誤：拼錯屬性名
const item: InventoryItem = { ... };
console.log(item.naem);  // 應該是 name

// 解決：檢查屬性名稱拼寫
console.log(item.name);
```

### 錯誤 4: Parameter 'X' implicitly has an 'any' type

```typescript
// 錯誤
const handleClick = (e) => { ... };  // e 沒有型別

// 解決：加上型別
const handleClick = (e: React.MouseEvent) => { ... };
```

### 錯誤 5: 泛型問題

```typescript
// 錯誤：render 函式參數型別不正確
const columns: ColumnsType<InventoryItem> = [
  {
    title: '數量',
    render: (value) => { ... },  // value 是 any
  },
];

// 解決：明確標註型別
const columns: ColumnsType<InventoryItem> = [
  {
    title: '數量',
    render: (_: unknown, record: InventoryItem) => 
      `${record.quantity} ${record.unit}`,
  },
];
```

---

## 學習資源

1. **TypeScript 官方文件（中文）**
   https://www.typescriptlang.org/zh/docs/

2. **React TypeScript Cheatsheet**
   https://react-typescript-cheatsheet.netlify.app/

3. **TypeScript Deep Dive（免費電子書）**
   https://basarat.gitbook.io/typescript/

4. **Ant Design TypeScript 示例**
   https://ant-design.antgroup.com/docs/react/use-in-typescript-cn

5. **Type Challenges（練習題）**
   https://github.com/type-challenges/type-challenges

---

## 建議學習順序

1. ✅ 基礎型別（string, number, boolean, array）
2. ✅ Interface 和 Type
3. ✅ React 元件 Props 型別
4. ✅ useState 和事件處理型別
5. ⬜ 泛型基礎
6. ⬜ 工具型別（Partial, Pick, Omit）
7. ⬜ 型別守衛和型別縮小
8. ⬜ 進階泛型和條件型別

祝學習順利！🚀
