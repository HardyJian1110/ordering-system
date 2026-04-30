import { Card, Button, Descriptions, Spin, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import type { DescriptionsProps } from "antd";
// 假设你已经写好了这个 API
import { getContractDetail } from "../../api/contract";

// 定义从后端拿到的数据类型（严格对应数据库列名）
interface ContractDetail {
  contractNo: string;
  type: string;
  name: string;
  startDate: string;
  endDate: string;
  partyA: string;
  partyB: string;
  status: number;
  rejectionReason?: string;
  tel: string;
  additionalTerms?: string;
}

function Surrender() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractNo = searchParams.get("contractNo");

  const [data, setData] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. 请求后端数据
  useEffect(() => {
    if (contractNo) {
      loadDetail(contractNo);
    }
  }, [contractNo]);

  const loadDetail = async (no: string) => {
    setLoading(true);
    try {
      // 这里的接口对应后端 @GetMapping("/detail/{contractNo}")
      const res = await getContractDetail(no);
      setData(res.data);
    } catch (error) {
      message.error("获取详情失败");
    } finally {
      setLoading(false);
    }
  };
  // 2. 动态生成 Descriptions 列表
  const items: DescriptionsProps["items"] = useMemo(() => {
    if (!data) return [];

    // 【关键修复】：显式声明类型为 DescriptionsProps["items"]
    const baseItems: DescriptionsProps["items"] = [
      { key: "1", label: "合同类别", children: data.type },
      { key: "2", label: "合同名称", children: data.name },
      { key: "3", label: "合同开始日期", children: data.startDate },
      { key: "4", label: "合同结束日期", children: data.endDate },
      { key: "5", label: "甲方", children: data.partyA },
      { key: "6", label: "乙方", children: data.partyB, span: 3 },
      {
        key: "7",
        label: "审批状态",
        children: data.status === 1 ? "未审批" : data.status === 2 ? "审批通过" : "审批拒绝",
      },
    ];

    if (data.status === 3) {
      baseItems.push({ key: "8", label: "拒绝原因", children: data.rejectionReason || "无" });
    }

    baseItems.push({ key: "9", label: "联系方式", children: data.tel });

    // 现在这里就不会报错了，因为 baseItems 已经知道 children 可以是 ReactNode
    baseItems.push({
      key: "10",
      label: "附加条款",
      children: <div style={{ whiteSpace: "pre-wrap" }}>{data.additionalTerms || "暂无附加条款"}</div>,
    });

    return baseItems;
  }, [data]);
  return (
    <div>
      <Card>
        <Button type="primary" onClick={() => navigate("/finance/contract?return=true")}>
          返回
        </Button>
      </Card>

      <Card className="mt">
        <Spin spinning={loading}>
          {data && <Descriptions title={`合同编号：${data.contractNo}`} bordered items={items} />}
        </Spin>
      </Card>
    </div>
  );
}

export default Surrender;
