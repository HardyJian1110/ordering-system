import { Button, Empty, Typography } from "antd";
import { Link } from "react-router-dom";
function NotFound() {
  return (
    <div style={{ marginTop: "100px" }}>
      {" "}
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{ height: 60 }}
        description={
          <Typography.Text>
            Kind Reminder
            <a href="#API">Page not found</a>
          </Typography.Text>
        }
      >
        <Button type="primary">
          <Link to="/dashboard">Back to Home</Link>
        </Button>
      </Empty>
    </div>
  );
}

export default NotFound;
