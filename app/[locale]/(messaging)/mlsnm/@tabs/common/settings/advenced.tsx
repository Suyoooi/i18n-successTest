'use client';

import Toggle from '@/app/[locale]/components/toggleSwitch/toggle';
import Input from '@/app/[locale]/components/input/input';
import AlertThresholdsInput from '@/app/[locale]/components/progress/alertThresholdsInput';
import ProgressComponent from '@/app/[locale]/components/progress/progressComponent';
import Select from '@/app/[locale]/components/select/select';
import { useEffect, useState } from 'react';

interface AdvancedProp {
  data: any;
  hiddenMenu: boolean;
  isEditStatus: boolean;
  onTitleClick: (tipNum: number) => void;
  onUpdateData: (data: any) => void;
}

const Advenced: React.FC<AdvancedProp> = ({
  data,
  hiddenMenu,
  isEditStatus,
  onTitleClick,
  onUpdateData
}) => {
  useEffect(() => {
    if (data) {
      setIsDynamicEnable(data.dmrEnabled || false);
      setIsSubscriptions(data.exportSubscriptionsEnabled || false);
      setIsClientVpnEvent(data.eventPublishClientEnabled || false);
      setIsMsgVpnEvent(data.eventPublishMsgVpnEnabled || false);
      setIsMqttFormat(data.eventPublishTopicFormatMqttEnabled || false);
      setIsSmfFormat(data.eventPublishTopicFormatSmfEnabled || false);
      setIsMsgBus(data.sempOverMsgBusEnabled || false);
      setIsAdminCommands(data.sempOverMsgBusAdminEnabled || false);
      setIsClientCommands(data.sempOverMsgBusAdminClientEnabled || false);
      setIsCacheCommands(
        data.sempOverMsgBusAdminDistributedCacheEnabled || false
      );
      setIsShowCommands(data.sempOverMsgBusShowEnabled || false);
    }
  }, [data]);

  const [isDynamicEnable, setIsDynamicEnable] = useState<boolean>(
    data.dmrEnabled
  );
  const [isSubscriptions, setIsSubscriptions] = useState<boolean>(
    data.exportSubscriptionsEnabled
  );
  const [isClientVpnEvent, setIsClientVpnEvent] = useState<boolean>(
    data.eventPublishClientEnabled
  );
  const [isMsgVpnEvent, setIsMsgVpnEvent] = useState<boolean>(
    data.eventPublishMsgVpnEnabled
  );
  const [isMqttFormat, setIsMqttFormat] = useState<boolean>(
    data.eventPublishTopicFormatMqttEnabled
  );
  const [isSmfFormat, setIsSmfFormat] = useState<boolean>(
    data.eventPublishTopicFormatSmfEnabled
  );
  const [isMsgBus, setIsMsgBus] = useState<boolean>(data.sempOverMsgBusEnabled);
  const [isAdminCommands, setIsAdminCommands] = useState<boolean>(
    data.sempOverMsgBusAdminEnabled
  );
  const [isClientCommands, setIsClientCommands] = useState<boolean>(
    data.sempOverMsgBusAdminClientEnabled
  );
  const [isCacheCommands, setIsCacheCommands] = useState<boolean>(
    data.sempOverMsgBusAdminDistributedCacheEnabled
  );
  const [isShowCommands, setIsShowCommands] = useState<boolean>(
    data.sempOverMsgBusShowEnabled
  );

  const handleToggleChange = () => {
    setIsDynamicEnable(!isDynamicEnable);
  };
  const handleToggleChange2 = () => {
    setIsSubscriptions(!isDynamicEnable);
  };
  const handleToggleChange3 = () => {
    setIsClientVpnEvent(!isClientVpnEvent);
  };
  const handleToggleChange4 = () => {
    setIsMsgVpnEvent(!isMsgVpnEvent);
  };
  const handleToggleChange5 = () => {
    setIsMqttFormat(!isMqttFormat);
  };
  const handleToggleChange6 = () => {
    setIsSmfFormat(!isSmfFormat);
  };
  const handleToggleChange7 = () => {
    setIsMsgBus(!isMsgBus);
  };
  const handleToggleChange8 = () => {
    setIsAdminCommands(!isAdminCommands);
  };
  const handleToggleChange9 = () => {
    setIsClientCommands(!isClientCommands);
  };
  const handleToggleChange10 = () => {
    setIsCacheCommands(!isCacheCommands);
  };
  const handleToggleChang11 = () => {
    setIsShowCommands(!isShowCommands);
  };

  const handleTipsClick = (id: number) => {
    console.log(id);
    console.log('tips click');
    onTitleClick(id);
  };

  const componentsData = [
    // 첫 번째 alertThresholds
    // {
    //   progressKey: "eventMsgSpoolUsageThreshold",
    //   inputKey: "maxMsgSpoolUsage",
    //   title: "Msg Spool Usage",
    // },
    {
      progressKey: 'eventTransactedSessionCountThreshold',
      inputKey: 'maxTransactedSessionCount',
      title: 'Maximum Transacted Sessions',
      id: 4
    },
    {
      progressKey: 'eventTransactionCountThreshold',
      inputKey: 'maxTransactionCount',
      title: 'Maximum Transactions',
      id: 6
    },
    {
      progressKey: 'eventEndpointCountThreshold',
      inputKey: 'maxEndpointCount',
      title: 'Maximum Queues and Topic Endpoints',
      id: 8
    },
    // {
    //   progressKey: "",
    //   inputKey: "",
    //   title: "Maximum Outgoing Flows",
    //   id: 10,
    // },
    // {
    //   progressKey: "",
    //   inputKey: "",
    //   title: "Maximum Incoming Flows",
    //   id: 12,
    // },
    {
      progressKey: 'eventEgressFlowCountThreshold',
      inputKey: 'maxEgressFlowCount',
      title: 'Maximum Outgoing Flows',
      id: 10
    },
    {
      progressKey: 'eventIngressFlowCountThreshold',
      inputKey: 'maxIngressFlowCount',
      title: 'Maximum Incoming Flows',
      id: 12
    },
    {
      progressKey: 'eventConnectionCountThreshold',
      inputKey: 'maxConnectionCount',
      title: 'Maximum Client Connections',
      id: 14
    }
    // {
    //   progressKey: "eventEgressMsgRateThreshold",
    //   inputKey: "maxEgressMsgRateThreshold",
    //   title: "Outgoing Rate Alert Thresholds",
    // },
    // {
    //   progressKey: "eventIngressMsgRateThreshold",
    //   inputKey: "maxIngressMsgRateThreshold",
    //   title: "Incoming Rate Alert Thresholds",
    // },
    // {
    //   progressKey: "eventSubscriptionCountThreshold",
    //   inputKey: "maxSubscriptionCount",
    //   title: "Maximum Client Subscriptions",
    // },
  ];

  const handleChangeValue = (newValue: any) => {
    console.log('받아옴:::', newValue);
    onUpdateData(newValue);
  };
  return (
    <>
      {hiddenMenu && (
        <div className="sol_ml_10">
          {data.eventMsgSpoolUsageThreshold && (
            <ProgressComponent
              title={'eventMsgSpoolUsageThreshold'}
              isEditStatus={isEditStatus}
              proData={data.eventMsgSpoolUsageThreshold}
              tipNo={3}
              callbackTipVal={() => handleTipsClick(3)}
              depthNo={1}
              onUpdateData={handleChangeValue}
            />
          )}
          {componentsData.map(({ progressKey, inputKey, title, id }) => (
            <>
              <Input
                text={title}
                value={data[inputKey]}
                tipNo={data[id]}
                onTitleClick={() => handleTipsClick(id)}
              />
              {data[progressKey] && (
                <ProgressComponent
                  title={progressKey}
                  isEditStatus={isEditStatus}
                  proData={data[progressKey]}
                  tipNo={data[id + 1]}
                  callbackTipVal={() => handleTipsClick(id + 1)}
                  depthNo={1}
                  onUpdateData={handleChangeValue}
                />
              )}
            </>
          ))}
          {data.eventEgressMsgRateThreshold && (
            <AlertThresholdsInput
              title={'Outgoing Rate Alert Thresholds'}
              proData={data.eventEgressMsgRateThreshold}
              tipNo={16}
              onTitleClick={() => handleTipsClick(16)}
            />
          )}
          {data.eventIngressMsgRateThreshold && (
            <AlertThresholdsInput
              title={'Incoming Rate Alert Thresholds'}
              proData={data.eventIngressMsgRateThreshold}
              tipNo={17}
              onTitleClick={() => handleTipsClick(17)}
            />
          )}
          {data.eventSubscriptionCountThreshold && (
            <div>
              <Input
                text={'Maximum Client Subscriptions'}
                value={data.maxSubscriptionCount}
                tipNo={18}
                onTitleClick={() => handleTipsClick(18)}
              />
              <ProgressComponent
                title={'eventSubscriptionCountThreshold'}
                isEditStatus={isEditStatus}
                proData={data.eventSubscriptionCountThreshold}
                tipNo={19}
                callbackTipVal={() => handleTipsClick(19)}
                depthNo={1}
                onUpdateData={handleChangeValue}
              />
            </div>
          )}
          <Input
            text={'Max Kafka Broker Connections'}
            value={data.maxKafkaBrokerConnectionCount}
            tipNo={20}
            onTitleClick={() => handleTipsClick(20)}
          />
          <ProgressComponent
            title={'maxKafkaBrokerConnectionCount'}
            isEditStatus={isEditStatus}
            proData={data.maxKafkaBrokerConnectionCount}
            tipNo={19}
            callbackTipVal={() => handleTipsClick(19)}
            depthNo={1}
            onUpdateData={handleChangeValue}
          />
          <Toggle
            label="Dynamic Message Routing"
            isEnabled={isDynamicEnable}
            toggleId={'setEnable1'}
            onToggle={handleToggleChange}
            tipNo={21}
            onTitleClick={() => handleTipsClick(21)}
          />
          <Toggle
            label="Export Subscriptions"
            isEnabled={isSubscriptions}
            toggleId={'setEnable2'}
            onToggle={handleToggleChange2}
            tipNo={22}
            onTitleClick={() => handleTipsClick(22)}
          />
          <Input
            text={'Large Message Size Threshold (KB)'}
            value={data.eventLargeMsgThreshold}
            tipNo={23}
            onTitleClick={() => handleTipsClick(23)}
          />
          {/* Event Configuration */}
          <label
            className="col-sm-4 col-form-label"
            htmlFor="set_maximummtransacted">
            Event Configuration
          </label>
          <Input
            text={'Events Log Tag'}
            value={data.eventLogTag}
            tipNo={24}
            depthNo={1}
            onTitleClick={() => handleTipsClick(24)}
          />
          <Toggle
            label="Publish Client Event Messages"
            isEnabled={isClientVpnEvent}
            toggleId={'setEnable3'}
            onToggle={handleToggleChange3}
            tipNo={25}
            depthNo={1}
            onTitleClick={() => handleTipsClick(25)}
            // 현재 advanced는 수정할 수 없기 때문에 값을 보내지 않음
            // isEdit={!isEditStatus}
          />
          <Toggle
            label="Publish Message VPN Event Messages"
            isEnabled={isMsgVpnEvent}
            toggleId={'setEnable4'}
            onToggle={handleToggleChange4}
            tipNo={26}
            depthNo={1}
            onTitleClick={() => handleTipsClick(26)}
          />
          <Select
            text={'Publish Subscription Event Messages'}
            value={data.eventLogTag}
            tipNo={27}
            onTitleClick={() => handleTipsClick(27)}
            depthNo={1}
          />
          <Toggle
            label="Publish in MQTT Format"
            isEnabled={isMqttFormat}
            toggleId={'setEnable5'}
            onToggle={handleToggleChange5}
            tipNo={28}
            depthNo={1}
            onTitleClick={() => handleTipsClick(28)}
          />
          <Toggle
            label="Publish in SMF Format"
            isEnabled={isSmfFormat}
            toggleId={'setEnable6'}
            onToggle={handleToggleChange6}
            tipNo={29}
            depthNo={1}
            onTitleClick={() => handleTipsClick(29)}
          />
          {/* ===== */}
          <Toggle
            label="SEMP Over Message Bus"
            isEnabled={isMsgBus}
            toggleId={'setEnable7'}
            onToggle={handleToggleChange7}
            tipNo={30}
            onTitleClick={() => handleTipsClick(30)}
          />
          <Toggle
            label="Admin Commands"
            isEnabled={isAdminCommands}
            toggleId={'setEnable8'}
            onToggle={handleToggleChange8}
            tipNo={31}
            onTitleClick={() => handleTipsClick(31)}
            depthNo={1}
          />
          <Toggle
            label="Client Commands"
            isEnabled={isClientCommands}
            toggleId={'setEnable9'}
            onToggle={handleToggleChange9}
            tipNo={32}
            onTitleClick={() => handleTipsClick(32)}
            depthNo={2}
          />
          <Toggle
            label="Distributed Cache Commands"
            isEnabled={isCacheCommands}
            toggleId={'setEnable10'}
            onToggle={handleToggleChange10}
            tipNo={33}
            onTitleClick={() => handleTipsClick(33)}
            depthNo={2}
          />
          <Toggle
            label="Show Commands"
            isEnabled={isShowCommands}
            toggleId={'setEnable11'}
            onToggle={handleToggleChang11}
            tipNo={34}
            onTitleClick={() => handleTipsClick(34)}
            depthNo={1}
          />
        </div>
      )}
    </>
  );
};

export default Advenced;
