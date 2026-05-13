import { notification } from "antd";
import newOrderAudio from "../../assets/newOrderComing.mp3";

type ReminderMessage = {
  type?: number;
  orderId?: number;
  content?: string;
};

let socket: WebSocket | null = null;
let reconnectTimer: number | null = null;
let currentSid = "";
let shouldReconnect = false;
const RECONNECT_DELAY = 2000;

function getWsBaseUrl() {
  const fromEnv = process.env.REACT_APP_WS_BASE;
  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }

  // CRA dev server runs on :3000 while backend websocket is on :8080.
  if (process.env.NODE_ENV === "development") {
    return "ws://localhost:8080";
  }

  const protocol = "ws";
  return `${protocol}://${window.location.host}`;
}

function clearReconnectTimer() {
  if (reconnectTimer !== null) {
    window.clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function playReminderAudio() {
  try {
    const audio = new Audio(newOrderAudio);
    audio.play().catch(() => {
      // Browsers may block autoplay; keep silent and still show notification.
    });
  } catch {
    // Ignore audio errors to avoid affecting notification flow.
  }
}

function showOrderNotification(payload: ReminderMessage) {
  const orderIdText = payload.orderId ? `#${payload.orderId}` : "";
  const baseDesc = orderIdText
    ? `Order ${orderIdText} requires your attention.`
    : "A new order requires your attention.";

  const desc = payload.content ? `${baseDesc} ${payload.content}` : baseDesc;

  notification.open({
    message: "New Order",
    description: desc,
    placement: "topRight",
    className: "order-reminder-notice",
    duration: 6,
  });

  playReminderAudio();
}

function scheduleReconnect() {
  if (!shouldReconnect || !currentSid) {
    return;
  }

  clearReconnectTimer();
  reconnectTimer = window.setTimeout(() => {
    connect(currentSid);
  }, RECONNECT_DELAY);
}

function connect(sid: string) {
  if (!sid) {
    return;
  }

  const wsUrl = `${getWsBaseUrl()}/ws/${encodeURIComponent(sid)}`;

  try {
    socket = new WebSocket(wsUrl);
  } catch {
    scheduleReconnect();
    return;
  }

  socket.onopen = () => {
    clearReconnectTimer();
  };

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data) as ReminderMessage;
      if (payload?.type === 1) {
        showOrderNotification(payload);
      }
    } catch {
      // Ignore invalid payload to keep socket stable.
    }
  };

  socket.onclose = () => {
    socket = null;
    scheduleReconnect();
  };

  socket.onerror = () => {
    try {
      socket?.close();
    } catch {
      // no-op
    }
  };
}

export function startOrderReminderSocket(username: string) {
  if (!username) {
    return;
  }

  const sid = `${username}_${Date.now()}`;

  shouldReconnect = true;
  currentSid = sid;

  if (socket && socket.readyState === WebSocket.OPEN) {
    return;
  }

  if (socket && socket.readyState === WebSocket.CONNECTING) {
    return;
  }

  connect(sid);
}

export function stopOrderReminderSocket() {
  shouldReconnect = false;
  currentSid = "";
  clearReconnectTimer();

  if (socket) {
    try {
      socket.onclose = null;
      socket.close();
    } catch {
      // no-op
    }
    socket = null;
  }
}
