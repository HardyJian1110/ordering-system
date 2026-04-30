import { Row, Col, Card, Progress, Statistic, Timeline, Tag } from "antd";
import { RadarChartOutlined, SnippetsOutlined, DollarOutlined, LaptopOutlined } from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import { getEnergyData } from "../../api/dashboard";
import { useEffect, useState } from "react";
import "./index.scss";

const option2 = {
  title: {
    text: "Enterprise Qualifications (Units)",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "15%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    boundaryGap: [0, 0.01],
    data: ["2014", "2016", "2018", "2020", "2022", "2024"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "Tech Enterprises",
      type: "bar",
      data: [40, 220, 378, 658, 1122, 1200],
    },
    {
      name: "High-tech Enterprises",
      type: "bar",
      data: [20, 39, 443, 490, 559, 762],
    },
    {
      name: "State-owned Enterprises",
      type: "bar",
      data: [78, 167, 229, 330, 380, 420],
    },
  ],
};

const option3 = {
  legend: {
    top: "10px",
  },
  series: [
    {
      name: "Nightingale Chart",
      type: "pie",
      radius: [30, 100],
      center: ["50%", "50%"],
      roseType: "area",
      itemStyle: {
        borderRadius: 8,
      },
      data: [
        { value: 40, name: "In Operation" },
        { value: 38, name: "Leased" },
        { value: 32, name: "To Let" },
        { value: 30, name: "Renewed" },
        { value: 28, name: "Newly Signed" },
        { value: 26, name: "Vacant" },
        { value: 22, name: "Terminated" },
      ],
    },
  ],
};

function Dashboard() {
  const initalOption = {
    title: {
      text: "Daily Energy Consumption",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: ["0:00", "4:00", "8:00", "12:00", "16:00", "20:00", "24:00"],
    },
    yAxis: {
      type: "value",
    },
    series: [],
  };

  const [data, setData] = useState(initalOption);

  useEffect(() => {
    const loadData = async () => {
      const { data: apiData } = await getEnergyData();
      const dataList = apiData.map((item: any) => ({
        name: item.name,
        data: item.data,
        type: "line",
        stack: "Total",
      }));
      const updataOption = {
        ...data,
        legend: {
          data: dataList.map((item: any) => item.name),
        },
        series: dataList,
        grid: {
          top: "80px",
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
      };
      setData(updataOption);
    };
    loadData();
  }, []);

  return (
    <div className="dashboard">
      <Row gutter={16}>
        <Col span={6}>
          <Card className="clearfix">
            <div className="fl area">
              <h2>13479</h2>
              <p>Total Park Area (㎡)</p>
            </div>
            <div className="fr">
              <RadarChartOutlined className="icon" />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="clearfix">
            <div className="fl area">
              <h2>8635</h2>
              <p>Total Leased Area (㎡)</p>
            </div>
            <div className="fr">
              <SnippetsOutlined className="icon" style={{ color: "#81c452" }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="clearfix">
            <div className="fl area">
              <h2>38764</h2>
              <p>Total Output Value (10k euro)</p>
            </div>
            <div className="fr">
              <DollarOutlined className="icon" style={{ color: "#62c9cb" }} />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="clearfix">
            <div className="fl area">
              <h2>2874</h2>
              <p>Total Resident Enterprises</p>
            </div>
            <div className="fr">
              <LaptopOutlined className="icon" style={{ color: "#e49362" }} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mt">
        <Col span={12}>
          <Card title="Energy Consumption Status">
            <ReactECharts option={data}></ReactECharts>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Enterprise Qualifications">
            <ReactECharts option={option2}></ReactECharts>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mt">
        <Col span={12}>
          <Card title="Leasing Status">
            <ReactECharts option={option3}></ReactECharts>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Charging Pile Availability">
            <div className="wrap">
              <Progress type="circle" percent={75} />
              <Statistic title="Total Charging Piles" value={75} suffix="/ 100" className="mt" />
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Real-time Vehicle Info" style={{ height: "406px" }}>
            <Timeline
              items={[
                {
                  children: (
                    <>
                      <Tag color="green">Entry</Tag>08:24 Vehicle A66666
                    </>
                  ),
                },
                {
                  children: (
                    <>
                      <Tag color="red">Exit</Tag>09:15 Vehicle A66666{" "}
                    </>
                  ),
                  color: "red",
                },
                {
                  children: (
                    <>
                      <Tag color="green">Entry</Tag>09:22 Vehicle A23456{" "}
                    </>
                  ),
                },
                {
                  children: (
                    <>
                      <Tag color="red">Exit</Tag>10:43 Vehicle A18763{" "}
                    </>
                  ),
                  color: "red",
                },
                {
                  children: (
                    <>
                      <Tag color="green">Entry</Tag>13:38 Vehicle A88888{" "}
                    </>
                  ),
                },
                {
                  children: (
                    <>
                      <Tag color="green">Entry</Tag>14:46 Vehicle A23456{" "}
                    </>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
