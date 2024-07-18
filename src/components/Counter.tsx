import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";
import { useTelegramInitData } from "../hooks/useTelegramInitData";
import WebApp from "@twa-dev/sdk";
import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Ellipsis,
  Button,
} from "./styled/styled";

export function Counter() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();
  const initData = useTelegramInitData();

  console.log({ initData });

  const testPayment = async () => {
    WebApp.openInvoice(
      "https://t.me/$bD9YmNq3wFQLAQAAa5bWpiYh224",
      (status) => {
        console.log(111, status);
      }
    );
  };

  return (
    <div className="Container">
      <TonConnectButton />
      <Button
        onClick={() => {
          testPayment();
        }}
      >
        Test
      </Button>
      <h1>initData</h1>
      <pre>{JSON.stringify(initData, null, 2)}</pre>

      <Card>
        <FlexBoxCol>
          <h3>Counter</h3>
          <FlexBoxRow>
            <b>Address</b>
            <Ellipsis>{address}</Ellipsis>
          </FlexBoxRow>
          <FlexBoxRow>
            <b>Value</b>
            <div>{value ?? "Loading..."}</div>
          </FlexBoxRow>
          <Button
            disabled={!connected}
            className={`Button ${connected ? "Active" : "Disabled"}`}
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment
          </Button>
        </FlexBoxCol>
      </Card>
    </div>
  );
}
