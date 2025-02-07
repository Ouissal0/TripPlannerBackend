import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient<Socket>();
      // Récupérer le token depuis les données d'authentification du client WebSocket
      const authToken = client.handshake?.auth?.token;
      
      // Créer un objet request similaire à celui de HTTP pour la validation JWT
      return {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      };
    }
    return context.switchToHttp().getRequest();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      if (context.getType() === 'ws') {
        throw new WsException('Unauthorized access');
      }
      return super.handleRequest(err, user, info, context);
    }
    return user;
  }
}
