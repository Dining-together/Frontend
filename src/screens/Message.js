import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SmallButton } from '../components';
import { ScrollView } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const ChatEntireCon = styled.View`
  flex: 9;
  background-color: ${({ theme }) => theme.background};
`;

const InputContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

const ChatInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.inputPlaceholder,
}))`
    width: 80%;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    padding: 20px 10px;
    font-size: 16px;
    border: 1px solid;
`;

const OtherchatContainer = styled.View`
  background-color: ${({ theme }) => theme.chatTextColor};
  margin-bottom: 5px;
  flex-direction: row;
  border: 0.8px solid;
  border-radius: 4px;
  padding: 3%;
  margin: 3%;
  margin-top: 1px;
  align-self: flex-start;
  max-width: 60%;
`;

const OwnchatContainer = styled.View`
  background-color: ${({ theme }) => theme.chatTextColor};
  margin-bottom: 5px;
  flex-direction: row;
  border: 0.8px solid;
  border-radius: 4px;
  padding: 3%;
  margin: 3%;
  align-items: flex-end;
  justify-content: flex-end;
  align-self: flex-end;
  max-width: 60%;
`;

const ChatText = styled.Text`
  color: ${({ theme }) => theme.text};
  font-size: 16px;
`;

const ChatContainer  = styled.View`
  flex-direction: row;
  justify-content: ${({ style }) => style ? "flex-end" : "flex-start"};
`;

const OtherEntireCon = styled.View`

`;

const TimeContainer  = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 3%;
`;

const TimeText = styled.Text`
  font-size: 14px;
  justify-content: flex-end;
  align-self: flex-end;
`;

const UserNameText = styled.Text`
  font-size: 14px;
  margin-left: 3%;
`;

const OwnChat = ({chat: {id, name, desc} }) => {
  return (
    <ChatContainer style = {true}>
      <TimeContainer>
        <TimeText>2:42</TimeText>
      </TimeContainer>
      <OwnchatContainer>
        <ChatText>안녕하세요</ChatText>
      </OwnchatContainer>
  </ChatContainer>
  );
};

const OtherChat = ({chat: {id, name, desc} }) => {
  return (
    <OtherEntireCon>
    <UserNameText>{route.params.name}</UserNameText>
      <ChatContainer>
        <OtherchatContainer>
          <ChatText>넵 안녕하세요</ChatText>
        </OtherchatContainer>
        <TimeContainer>
          <TimeText>2:45</TimeText>
        </TimeContainer>
      </ChatContainer>
      </OtherEntireCon>
  );
};


const _handleMessageSend = () => {};

const Message = ({navigation, route}) => {

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState();

  // 추후 데이터 받아오고 수정

  return (
    <Container>
      <ChatEntireCon>
      <ScrollView>
            <ChatContainer style = {true}>
              <TimeContainer>
                <TimeText>2:42</TimeText>
              </TimeContainer>
              <OwnchatContainer>
                <ChatText>안녕하세요</ChatText>
              </OwnchatContainer>
          </ChatContainer>

          <OtherEntireCon>
              <UserNameText>{route.params.name}</UserNameText>
                <ChatContainer>
                  <OtherchatContainer>
                    <ChatText>넵 안녕하세요</ChatText>
                  </OtherchatContainer>
                  <TimeContainer>
                    <TimeText>2:45</TimeText>
                  </TimeContainer>
                </ChatContainer>
          </OtherEntireCon>

          <ChatContainer style = {true}>
              <TimeContainer>
                <TimeText>2:42</TimeText>
              </TimeContainer>
              <OwnchatContainer>
                <ChatText>안녕하세요</ChatText>
              </OwnchatContainer>
          </ChatContainer>

          <OtherEntireCon>
              <UserNameText>{route.params.name}</UserNameText>
                <ChatContainer>
                  <OtherchatContainer>
                    <ChatText>넵 안녕하세요</ChatText>
                  </OtherchatContainer>
                  <TimeContainer>
                    <TimeText>2:45</TimeText>
                  </TimeContainer>
                </ChatContainer>
          </OtherEntireCon>

          <ChatContainer style = {true}>
              <TimeContainer>
                <TimeText>2:42</TimeText>
              </TimeContainer>
              <OwnchatContainer>
                <ChatText>안녕하세요</ChatText>
              </OwnchatContainer>
          </ChatContainer>

          <OtherEntireCon>
              <UserNameText>{route.params.name}</UserNameText>
                <ChatContainer>
                  <OtherchatContainer>
                    <ChatText>넵 안녕하세요</ChatText>
                  </OtherchatContainer>
                  <TimeContainer>
                    <TimeText>2:45</TimeText>
                  </TimeContainer>
                </ChatContainer>
          </OtherEntireCon>

          <ChatContainer style = {true}>
              <TimeContainer>
                <TimeText>2:42</TimeText>
              </TimeContainer>
              <OwnchatContainer>
                <ChatText>안녕하세요</ChatText>
              </OwnchatContainer>
          </ChatContainer>

          <OtherEntireCon>
              <UserNameText>{route.params.name}</UserNameText>
                <ChatContainer>
                  <OtherchatContainer>
                    <ChatText>넵 안녕하세요</ChatText>
                  </OtherchatContainer>
                  <TimeContainer>
                    <TimeText>2:45</TimeText>
                  </TimeContainer>
                </ChatContainer>
          </OtherEntireCon>

          <ChatContainer style = {true}>
              <TimeContainer>
                <TimeText>2:42</TimeText>
              </TimeContainer>
              <OwnchatContainer>
                <ChatText>안녕하세요</ChatText>
              </OwnchatContainer>
          </ChatContainer>

          <OtherEntireCon>
              <UserNameText>{route.params.name}</UserNameText>
                <ChatContainer>
                  <OtherchatContainer>
                    <ChatText>넵 안녕하세요</ChatText>
                  </OtherchatContainer>
                  <TimeContainer>
                    <TimeText>2:45</TimeText>
                  </TimeContainer>
                </ChatContainer>
          </OtherEntireCon>
      </ScrollView>
      </ChatEntireCon>
      <InputContainer>
        <ChatInput
          value={text}
          onChangeText = { text => setText(text) }
          onSubmitEditing = {_handleMessageSend}
        />
        <SmallButton 
          title="전송"
          containerStyle={{ width: "20%",}}
          onPress={_handleMessageSend}
          />
      </InputContainer>
    </Container>
  );
};

export default Message;