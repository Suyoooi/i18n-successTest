export const TipsData = [
  {
    id: 0,
    tips_header: 'Click on a label or an input field to see help message.',
    tip_body: 'Double click on an input field to go to Edit mode.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 1,
    tips_header: 'Incoming',
    tip_body: 'Enable or disable incoming messages.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 2,
    tips_header: 'Outgoing',
    tip_body: 'Enable or disable outgoing messages.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: '/channel'
  },
  {
    id: 3,
    tips_header: 'Access Type',
    tip_body: 'The access type for delivering messages to consumer flows bound to the Queue.',
    tip_sub: [
      {
        header: 'Exclusive',
        body: 'Exclusive delivery of messages to the first bound consumer flow.',
      },
      {
        header: 'Non-Exclusive',
        body: 'Non-exclusive delivery of messages to bound consumer flows in a round-robin (if partition count is zero) or partitioned (if partition count is non-zero) fashion.',
      }
    ],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 4,
    tips_header: 'Messages Queued Quota (MB)',
    tip_body: 'The maximum message spool usage allowed by the Queue, in megabytes (MB). A value of 0 only allows spooling of the last message received and disables quota checking.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 5,
    tips_header: 'Alert Thresholds',
    tip_body: 'The thresholds for the message spool usage alert of the Queue, relative to Messages Queued Quota.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 6,
    tips_header: 'Owner',
    tip_body: 'The Client Username that owns the Queue and has permission equivalent to "Delete".',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 7,
    tips_header: 'Non-Owner Permission',
    tip_body: 'The permission level for all consumers of the Queue, excluding the owner.',
    tip_sub: [
      {
        header: 'No Access',
        body: 'Disallows all access.',
      },
      {
        header: 'Read Only',
        body: 'Read-only access to the messages.',
      },
      {
        header: 'Consume',
        body: 'Consume (read and remove) messages.',
      },
      {
        header: 'Modify Topic',
        body: 'Consume messages or modify the topic/selector.',
      },
      {
        header: 'Delete',
        body: 'Consume messages, modify the topic/selector or delete the Client created endpoint altogether.',
      },
    ],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 8,
    tips_header: 'Maximum Consumer Count',
    tip_body: 'The maximum number of consumer flows that can bind to the Queue.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 9,
    tips_header: 'Alert Thresholds',
    tip_body: 'The thresholds for the Queue consumer flows alert, relative to Maximum Consumer Count.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 10,
    tips_header: 'Maximum Message Size (B)',
    tip_body: 'The maximum message size allowed in the Queue, in bytes (B).',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 11,
    tips_header: 'Maximum Delivered Unacknowledged Messages per Flow',
    tip_body: 'The maximum number of messages delivered but not acknowledged per flow for the Queue.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 12,
    tips_header: 'DMQ Name',
    tip_body: 'The name of the Dead Message Queue (DMQ) used by the Queue.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 13,
    tips_header: 'Enable Client Delivery Count',
    tip_body: 'Enable or disable the ability for client applications to query the message delivery count of messages received from the Queue. This is a controlled availability feature. Please contact support to find out if this feature is supported for your use case.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 14,
    tips_header: 'Delivery Delay (sec)',
    tip_body: 'The delay, in seconds, to apply to messages arriving on the Queue before the messages are eligible for delivery.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 15,
    tips_header: '',
    tip_body: '',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 16,
    tips_header: 'Respect Message Priority',
    tip_body: 'Enable or disable the respecting of message priority. When enabled, messages contained in the Queue are delivered in priority order, from 9 (highest) to 0 (lowest). Regardless of this setting, message priority is not respected when browsing the queue, when the queue is used by a bridge, or if the queue is partitioned.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 17,
    tips_header: '',
    tip_body: '',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 18,
    tips_header: 'Respect TTL',
    tip_body: 'Enable or disable the respecting of the time-to-live (TTL) for messages in the Queue. When enabled, expired messages are discarded or moved to the DMQ.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 19,
    tips_header: 'Maximum TTL (sec)',
    tip_body: 'The maximum time in seconds a message can stay in the Queue when Respect TTL is enabled. A message expires when the lesser of the sender assigned TTL in the message and the Maximum TTL configured for the Queue, is exceeded. A value of 0 disables expiry.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 20,
    tips_header: 'Redelivery',
    tip_body: 'Enable or disable message redelivery. When enabled, the number of redelivery attempts is controlled by maxRedeliveryCount. When disabled, the message will never be delivered from the queue more than once.',
    tip_sub: [
      {
        header: '',
        body: 'Disabling Redelivery is a Controlled Availability (CA) feature. Please contact support to find out if this feature is supported for your use case.',
      }
    ],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 21,
    tips_header: 'Maximum Redelivery Count',
    tip_body: 'The maximum number of message redelivery attempts that will occur prior to the message being discarded or moved to the DMQ.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 22,
    tips_header: 'Maximum Redelivery Count',
    tip_body: 'The maximum number of message redelivery attempts that will occur prior to the message being discarded or moved to the DMQ.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 23,
    tips_header: 'Delayed Redelivery',
    tip_body: 'Enable or disable a message redelivery delay. When false, messages are redelivered as soon as possible.  When true, messages are redelivered according to the initial, max and multiplier.  This should only be enabled when redelivery is enabled.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 24,
    tips_header: 'Multiplier',
    tip_body: 'The amount each delay interval is multiplied by after each failed delivery attempt. This number is a floating point value between 1.00 and 5.00.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 25,
    tips_header: 'Initial Delay',
    tip_body: 'The delay to be used between the first 2 redelivery attempts.  This value is in milliseconds.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 26,
    tips_header: 'Maximum Delay',
    tip_body: 'The maximum delay to be used between any 2 redelivery attempts.  This value is in milliseconds.  Due to technical limitations, some redelivery attempt delays may slightly exceed this value.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 27,
    tips_header: '',
    tip_body: '',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 28,
    tips_header: 'Reject Messages to Sender on Discard',
    tip_body: 'Determines when to return negative acknowledgments (NACKs) to sending clients on message discards. Note that NACKs cause the message to not be delivered to any destination and Transacted Session commits to fail.',
    tip_sub: [
      {
        header: 'Silent',
        body: 'Silently discard messages.',
      },
      {
        header: 'Notify-Sender',
        body: 'NACK each message discard back to the client, except messages that are discarded because an endpoint is administratively disabled.',
      },
      {
        header: 'Notify-Sender-Include-Shutdown',
        body: 'NACK each message discard back to the client, including messages that are discarded because an endpoint is administratively disabled.',
      }
    ],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 29,
    tips_header: 'Reject Low Priority Messages',
    tip_body: 'Enable or disable the checking of low priority messages against the Reject Low Priority Messages Limit. When enabled, the Reject Messages to Sender on Discard option must have a value of "When Queue Enabled" or "Always" so that session events are sent to the sending clients whenever messages are not enqueued and are discarded. Before enabling it is recommended that the Reject Low Priority Messages Limit have a non-zero value to avoid inadvertently discarding all low priority messages.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 30,
    tips_header: 'Reject Low Priority Messages Limit',
    tip_body: 'The number of messages of any priority in the Queue above which low priority messages are not admitted but higher priority messages are allowed. To avoid inadvertently discarding all low priority messages, before enabling Reject Low Priority Messages it is recommended that you change the default value of 0 to a value more appropriate for your network.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 31,
    tips_header: 'Alert Thresholds',
    tip_body: 'The thresholds for the maximum allowed number of any priority messages queued in the Queue alert, relative to Reject Low Priority Messages Limit.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 32,
    tips_header: '',
    tip_body: '',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 33,
    tips_header: 'Consumer Acknowledgment Propagation',
    tip_body: 'Enable or disable the propagation of consumer acknowledgments (ACKs) received on the active replication Message VPN to the standby replication Message VPN.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },

  {
    id: 34,
    tips_header: '',
    tip_body: '',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 35,
    tips_header: 'Count',
    tip_body: 'The count of partitions of the queue. Only relevant for queues with an access type of non-exclusive. When zero, bound clients receive messages round-robin. Otherwise, bound clients receive messages from individually assigned partitions.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 36,
    tips_header: 'Rebalance Delay',
    tip_body: 'The delay (in seconds) before a partition rebalance is started once needed.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
  {
    id: 37,
    tips_header: 'Rebalance Max Handoff Time',
    tip_body: 'The maximum time (in seconds) to wait before handing off a partition while rebalancing.',
    tip_sub: [],
    moreYn: 'N',
    moreLink: ''
  },
];






// export const TipsData = [
//   { id: 1, tips_header: 'Enabled', tip_body: 'Enable or disable the Message VPN.', moreYn: 'N', moreLink: '' },
//   { id: 2, tips_header: 'Maximum Message Spool Usage (MB)', tip_body: 'The maximum message spool usage by the Message VPN, in megabytes.', moreYn: 'Y', moreLink: '/channel' },
//   { id: 3, tips_header: 'Alert Thresholds', tip_body: 'The thresholds for the message spool usage alert of the Message VPN, relative to Maximum Message Spool Usage.', moreYn: 'N', moreLink: '' },
//   { id: 4, tips_header: 'Maximum Transacted Sessions', tip_body: 'The maximum number of transacted sessions that can be created in the Message VPN.', moreYn: 'N', moreLink: '' },
//   { id: 5, tips_header: 'Alert Thresholds', tip_body: 'The thresholds for the transacted session count alert of the Message VPN, relative to Maximum Transacted Sessions.', moreYn: 'N', moreLink: '' },
//   { id: 6, tips_header: 'Maximum Transactions', tip_body: 'The maximum number of transactions that can be created in the Message VPN.', moreYn: 'N', moreLink: '' },
//   { id: 7, tips_header: 'Alert Thresholds', tip_body: 'The thresholds for the transaction count alert of the Message VPN, relative to Maximum Transactions.', moreYn: 'N', moreLink: '' },
//   { id: 8, tips_header: 'Maximum Queues and Topic Endpoints', tip_body: 'The maximum number of Queues and Topic Endpoints that can be created in the Message VPN.', moreYn: 'N', moreLink: '' },
//   { id: 9, tips_header: 'Alert Thresholds', tip_body: 'The thresholds for the Queues and Topic Endpoints count alert of the Message VPN, relative to Maximum Queues and Topic Endpoints.', moreYn: 'N', moreLink: '' },
//   { id: 10, tips_header: 'Maximum Outgoing Flows', tip_body: 'The maximum number of outgoing flows that can be created in the Message VPN.', moreYn: 'N', moreLink: '' },
//   { id: 11, tips_header: 'Alert Thresholds', tip_body: 'The thresholds for the egress flow count alert of the Message VPN, relative to Maximum Outgoing Flows', moreYn: 'N', moreLink: '' },
//   { id: 12, tips_header: 'Maximum Incoming Flows', tip_body: 'The maximum number of incoming flows that can be created in the Message VPN.', moreYn: 'N', moreLink: '' },



// ];