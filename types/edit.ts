export interface QueueSettingInputBody {
  set_incoming: string;
  set_outgoing: string;
  acc_exclusive: string;
  acc_nonExclusive: string;
  set_msgQueueQuota: number;
  set_owner: string;
  set_ownerpermission: string;
  set_maxConsumerCnt: number;
  set_maxMsgSize: string;
  set_maxDumpf: string;
  set_dmqNm: string;
  set_clientDeliCnt: string;
  set_deliveryDelay: string;
  set_msgPriority: string;
  set_respectTtl: string;
  set_maxTtl: string;
  set_redelivery: string;
  set_tryForever: string;
  set_maxRedeliveryCnt: string;
  set_delayedRedelivery: string;
  set_multiplier: number;
  set_initialDelay: string;
  set_maxDelay: string;
  set_rejectMsgSender: string;
  set_lowPriorityMsg: string;
  set_lowPriorityMsgLimit: string;
  set_conAckProp: string;
  set_partitionCount: string;
  set_rebalanceDelay: string;
  set_maxHandoffTime: string;
}


export interface QueueSettingBody {
  set_msgQueueQuota: number;
  set_maxConsumerCnt: number;
}




