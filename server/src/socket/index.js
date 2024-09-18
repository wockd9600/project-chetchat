'use strict';

import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import { createClient } from 'redis';


const ioEvents = (app, io) => {
	const idle = io.of('/idle');
	import('./idle.js').then((idleSocketHandler) => {
		idleSocketHandler.default(idle);
	});

	// router에서 socket 사용하기 위해서 장착
	app.set("io", idle);
};

const init = (app) => {
	const server = http.createServer(app);
	const io = new SocketIOServer(server, {
		connectionStateRecovery: {
			maxDisconnectionDuration: 2 * 60 * 1000,
			skipMiddlewares: true,
		},
	});

	// subClient가 pubClient의 복제본인 이유는 Redis Pub/Sub 메커니즘을 사용할 때입니다.
	// Redis 어댑터를 사용하여 Socket.IO에서는 Pub/Sub을 통해 소켓 간 이벤트를 전파합니다.
	// Socket.IO에서는 pubClient를 통해 발행(publish)하고, subClient를 통해 구독(subscribe)합니다.
	// 이렇게 하면 두 클라이언트가 각각의 역할을 수행하면서 메시지를 안전하게 교환할 수 있습니다.
	// 주요 이유는 다음과 같습니다:

	// Publish-Subscribe Pattern: Redis는 Pub/Sub 패턴을 사용하여 메시지를 발행하고 수신하는 기능을 제공합니다.
	// 							  pubClient는 이벤트를 발행하고, subClient는 해당 이벤트를 수신합니다.
	// Scalability: 복제본을 사용함으로써, 여러 서버 간에 Redis를 사용하여 소켓 통신을 할 때 확장성이 향상됩니다.
	//				각 서버는 자체 pubClient 및 subClient를 가지고 소켓 간 통신을 안전하게 처리할 수 있습니다.
	// Isolation: pubClient와 subClient가 분리되어 있어, 발행과 구독의 역할이 분명하게 구분되어 각각의 클라이언트가 안전하게 수행됩니다.

	// 따라서, 코드에서 pubClient를 복제하여 subClient를 만들고 있습니다. 이는 안전하고 효율적인 소켓 통신을 위한 방법 중 하나입니다.
	
	// pubClient와 subClient는 Socket.IO에서 사용되는 Pub/Sub 패턴을 위해 생성되었습니다. 이 두 클라이언트는 소켓 간 이벤트를 효과적으로 전파하고 수신하기 위해 사용됩니다.
	const pubClient = createClient();
	const subClient = pubClient.duplicate();

	// io.adapter(createAdapter(redisClient, redisClient));


	// ****************
	// *              *
	// * 발생했던 문제들  *
	// *              *
	// ****************
	Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
		io.adapter(createAdapter(pubClient, subClient));
	});

	ioEvents(app, io);

	return server;
};

export default init;
