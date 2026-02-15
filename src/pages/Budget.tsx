// ============================================
// Budget.tsx - 預算追蹤頁面
// ============================================

import React, { useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Progress, 
  Statistic, 
  Select, 
  Typography,
} from 'antd';
import type { BudgetCategory } from '../types';
import { mockBudgetCategories, calculateBudgetTotal } from '../mockData';

const { Title, Text } = Typography;

/**
 * Budget 元件
 */
const Budget: React.FC = () => {
  /**
   * 計算預算總計
   * 使用匯入的輔助函式
   */
  const budgetTotal = useMemo(() => {
    return calculateBudgetTotal(mockBudgetCategories);
  }, []);

  /**
   * 判斷進度條狀態
   */
  const getProgressStatus = (percentage: number): 'success' | 'exception' | 'active' => {
    if (percentage > 90) return 'exception';
    if (percentage > 70) return 'active';
    return 'success';
  };

  return (
    <div>
      {/* 頁面標題 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>預算追蹤</Title>
          <Text type="secondary">2026 年 2 月</Text>
        </div>
        <Select
          defaultValue="2026-02"
          options={[
            { value: '2026-02', label: '2026 年 2 月' },
            { value: '2026-01', label: '2026 年 1 月' },
          ]}
          style={{ width: 150 }}
        />
      </div>

      {/* 總覽卡片 */}
      <Card style={{ marginBottom: 16 }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Statistic
              title="本月支出"
              value={budgetTotal.spent}
              prefix="NT$"
              suffix={
                <Text type="secondary" style={{ fontSize: 14 }}>
                  / NT$ {budgetTotal.budget.toLocaleString()}
                </Text>
              }
            />
          </Col>
          <Col span={8}>
            <Progress 
              percent={budgetTotal.percentage} 
              status={getProgressStatus(budgetTotal.percentage)} 
            />
          </Col>
        </Row>
      </Card>

      {/* 分類卡片 */}
      <Row gutter={16}>
        {mockBudgetCategories.map((category: BudgetCategory) => {
          const percentage = Math.round((category.spent / category.budget) * 100);
          
          return (
            <Col span={12} key={category.name} style={{ marginBottom: 16 }}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text strong>{category.name}</Text>
                  <Text type="secondary">
                    NT$ {category.spent.toLocaleString()} / {category.budget.toLocaleString()}
                  </Text>
                </div>
                <Progress 
                  percent={percentage} 
                  strokeColor={category.color} 
                  showInfo={false} 
                />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {percentage}%
                </Text>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Budget;
