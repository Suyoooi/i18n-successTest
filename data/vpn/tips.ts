interface VpnTip {
  id: number;
  tips_header: string;
  tip_body: string;
  tip_sub?: any[];
  moreYn: string;
  moreLink: string;
}

export const VpnTipsData: VpnTip[] = [
  {
    id: 0,
    tips_header: "",
    tip_body:
      "Click on a label or an input field to see help message. Double click on an input field to go to Edit mode.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 1,
    tips_header: "Enabled",
    tip_body: "Enable or disable the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 2,
    tips_header: "Maximum Message Spool Usage (MB)",
    tip_body:
      "The maximum message spool usage by the Message VPN, in megabytes.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 3,
    tips_header: "Alert Thresholds",
    tip_body:
      "The thresholds for the message spool usage alert of the Message VPN, relative to Maximum Message Spool Usage.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 4,
    tips_header: "Maximum Transacted Sessions",
    tip_body:
      "The maximum number of transacted sessions that can be created in the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 5,
    tips_header: "Alert Thresholds",
    tip_body:
      "The thresholds for the transacted session count alert of the Message VPN, relative to Maximum Transacted Sessions.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 6,
    tips_header: "Maximum Transactions",
    tip_body:
      "The maximum number of transactions that can be created in the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 7,
    tips_header: "Alert Thresholds ",
    tip_body:
      "The thresholds for the transaction count alert of the Message VPN, relative to Maximum Transactions.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 8,
    tips_header: "Maximum Queues and Topic Endpoints",
    tip_body:
      "The maximum number of Queues and Topic Endpoints that can be created in the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 9,
    tips_header: "Alert Thresholds",
    tip_body:
      "The thresholds for the Queues and Topic Endpoints count alert of the Message VPN, relative to Maximum Queues and Topic Endpoints.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 10,
    tips_header: "Maximum Outgoing Flows",
    tip_body:
      "The maximum number of outgoing flows that can be created in the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 11,
    tips_header: "Alert Thresholds",
    tip_body:
      "The thresholds for the egress flow count alert of the Message VPN, relative to Maximum Outgoing Flows.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 12,
    tips_header: "Maximum Incoming Flows",
    tip_body:
      "The maximum number of incoming flows that can be created in the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 13,
    tips_header: "Alert Thresholds",
    tip_body:
      "The thresholds for the incoming flow count alert of the Message VPN, relative to Maximum Incoming Flows.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 14,
    tips_header: "Maximum Client Connections",
    tip_body: "The maximum number of client connections to the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 15,
    tips_header: "Alert Thresholds",
    tip_body:
      "The thresholds for the client connection count alert of the Message VPN, relative to Maximum Client Connections.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 16,
    tips_header: "Respect Message Priority",
    tip_body:
      "The thresholds for the egress message rate alert of the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 17,
    tips_header: "Incoming Rate Alert Thresholds ",
    tip_body:
      "The thresholds for the incoming message rate alert of the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 18,
    tips_header: "Maximum Client Subscriptions",
    tip_body:
      "The maximum number of local client subscriptions that can be added to the Message VPN. This limit is not enforced when a subscription is added using a management interface, such as CLI or SEMP.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 19,
    tips_header: "Alert Thresholds",
    tip_body:
      "The thresholds for the subscription count alert of the Message VPN, relative to Maximum Client Subscriptions.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 20,
    tips_header: "Max Kafka Broker Connections",
    tip_body:
      "The maximum number of simultaneous Kafka Broker connections of the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 21,
    tips_header: "Dynamic Message Routing",
    tip_body:
      "Enable or disable Dynamic Message Routing (DMR) for the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 22,
    tips_header: "Export Subscriptions",
    tip_body:
      "Enable or disable the export of subscriptions in the Message VPN to other routers in the network over Neighbor links.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 23,
    tips_header: "Large Message Size Threshold (KB)",
    tip_body:
      "The threshold, in kilobytes, after which a message is considered to be large for the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 24,
    tips_header: "Events Log Tag",
    tip_body: "A prefix applied to all published Events in the Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 25,
    tips_header: "Publish Client Event Messages",
    tip_body: "Enable or disable Client level Event message publishing.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 26,
    tips_header: "Publish Message VPN Event Messages",
    tip_body: "Enable or disable Message VPN level Event message publishing.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 27,
    tips_header: "Publish Subscription Event Messages",
    tip_body: "Subscription level Event message publishing mode.",
    tip_sub: [
      {
        header: "no publishing",
        body: "Disable client level event message publishing.",
      },
      {
        header: "publishing in format v1",
        body: "Enable client level event message publishing with format v1.",
      },
      {
        header: "publishing in format v1, no unsubscribe events on disconnect",
        body: `As "on-with-format-v1", but unsubscribe events are not generated when a client disconnects. Unsubscribe events are still raised when a client explicitly unsubscribes from its subscriptions.`,
      },
      {
        header: "publishing in format v2",
        body: `Enable client level event message publishing with format v2.`,
      },
      {
        header: "publishing in format v2, no unsubscribe events on disconnect",
        body: `As "on-with-format-v2", but unsubscribe events are not generated when a client disconnects. Unsubscribe events are still raised when a client explicitly unsubscribes from its subscriptions.`,
      },
    ],
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 28,
    tips_header: "Publish in MQTT Format",
    tip_body: "Enable or disable Event publish topics in MQTT format.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 29,
    tips_header: "Publish in SMF Format",
    tip_body: "Enable or disable Event publish topics in SMF format.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 30,
    tips_header: "SEMP Over Message Bus",
    tip_body:
      "Enable or disable SEMP over the message bus for the current Message VPN.",
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 31,
    tips_header: "Admin Commands",
    tip_body: `Enable or disable "admin" SEMP over the message bus commands for the current Message VPN.`,
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 32,
    tips_header: "Client Commands",
    tip_body: `Enable or disable "admin client" SEMP over the message bus commands for the current Message VPN.`,
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 33,
    tips_header: "Distributed Cache Commands",
    tip_body: `Enable or disable "admin distributed-cache" SEMP over the message bus commands for the current Message VPN.`,
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 34,
    tips_header: "Show Commands",
    tip_body: `Enable or disable "show" SEMP over the message bus commands for the current Message VPN.`,
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 35,
    tips_header: "Message Broker Name",
    tip_body: ``,
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 36,
    tips_header: "Message Broker IP Address",
    tip_body: ``,
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 37,
    tips_header: "Message Broker Port No",
    tip_body: ``,
    moreYn: "N",
    moreLink: "",
  },
  {
    id: 38,
    tips_header: " Message VPN Name",
    tip_body: ``,
    moreYn: "N",
    moreLink: "",
  },
];
