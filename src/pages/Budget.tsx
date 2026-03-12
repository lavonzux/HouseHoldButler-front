import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Progress,
  Statistic,
  Typography,
  Spin,
  Alert,
  DatePicker,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import type { BudgetSummary } from "@/types/budget";
import { budgetApi } from "@/api/budget";

const { Title, Text } = Typography;

// 依百分比決定分類進度條顏色
const getCategoryColor = (percentage: number): string => {
  if (percentage >= 100) return "#ff4d4f";
  if (percentage >= 90) return "#ff7a45";
  if (percentage >= 80) return "#faad14";
  if (percentage >= 60) return "#fadb14";
  return "#52c41a";
};

// 依百分比決定總覽進度條狀態
const getProgressStatus = (
  percentage: number,
): "success" | "exception" | "active" | "normal" => {
  if (percentage === 0) return "exception"; // 無資料
  if (percentage >= 90) return "exception";
  if (percentage >= 60) return "active";
  return "success";
};

const Budget: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs());
  const [budgetData, setBudgetData] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = useCallback(async (date: Dayjs) => {
    setLoading(true);
    setError(null);
    try {
      const data = await budgetApi.getBudgetByMonth(date.format("YYYY-MM"));
      setBudgetData(data);
    } catch (err) {
      setError("無法載入預算資料，請稍後再試。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudget(selectedMonth);
  }, [selectedMonth, fetchBudget]);

  return (
    <div>
      {/* 頁面標題 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            預算追蹤
          </Title>
          <Text type="secondary">{selectedMonth.format("YYYY 年 M 月")}</Text>
        </div>
        <DatePicker
          picker="month"
          value={selectedMonth}
          onChange={(date) => date && setSelectedMonth(date)}
          format="YYYY 年 M 月"
          allowClear={false}
          disabledDate={(current) =>
            current && current.isAfter(dayjs(), "month")
          }
        />
      </div>

      <Spin spinning={loading}>
        {error && (
          <Alert type="error" message={error} style={{ marginBottom: 16 }} />
        )}

        {budgetData && (
          <>
            {/* 總覽卡片 */}
            <Card style={{ marginBottom: 16 }}>
              <Row align="middle" justify="space-between">
                <Col>
                  <Statistic
                    title="本月支出"
                    value={budgetData.totalSpent}
                    prefix="NT$"
                    suffix={
                      <Text type="secondary" style={{ fontSize: 14 }}>
                        / NT$ {budgetData.totalBudget.toLocaleString()}
                      </Text>
                    }
                  />
                  {budgetData.totalBudget === 0 && (
                    <Text type="danger" style={{ fontSize: 13 }}>
                      尚未填寫預算
                    </Text>
                  )}
                </Col>
                <Col span={8}>
                  <Progress
                    percent={Math.round(budgetData.totalPercentage)}
                    status={getProgressStatus(budgetData.totalPercentage)}
                  />
                </Col>
              </Row>
            </Card>

            {/* 分類卡片 */}
            <Row gutter={16}>
              {budgetData.categories.map((category) => {
                const displayPct = Math.min(
                  Math.round(category.percentage),
                  100,
                );
                const color = getCategoryColor(category.percentage);

                return (
                  <Col
                    span={12}
                    key={category.categoryId}
                    style={{ marginBottom: 16 }}
                  >
                    <Card>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <Text strong>{category.categoryName}</Text>
                        <Text type="secondary">
                          NT$ {category.actualSpent.toLocaleString()} /{" "}
                          {category.budgetAmount.toLocaleString()}
                        </Text>
                      </div>
                      <Progress
                        percent={displayPct}
                        strokeColor={color}
                        showInfo={false}
                      />
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        {Math.round(category.percentage)}%
                      </Text>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </Spin>
    </div>
  );
};

export default Budget;
