package com.smarthome.optimizer.server2.websocket;

import com.smarthome.optimizer.server2.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * Handles chat messages sent to the /chat WebSocket endpoint.
 * Passes messages to ChatService and sends back responses.
 */
@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocketHandler.class);

    private final ChatService chatService;

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String input = message.getPayload();
        log.info("Received WebSocket message: {}", input);

        try {
            String response = chatService.handleMessage(input);
            session.sendMessage(new TextMessage(response));
            log.info("Sent response: {}", response);
        } catch (Exception ex) {
            log.error("Error handling WebSocket message", ex);
            session.sendMessage(new TextMessage("Error: " + ex.getMessage()));
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("WebSocket connection established: {}", session.getId());
        session.sendMessage(new TextMessage("Connected to SmartHome Optimizer WebSocket."));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        log.info("WebSocket connection closed: {}", session.getId());
    }
}
