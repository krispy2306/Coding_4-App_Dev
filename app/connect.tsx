import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, MOCK_SQUAD, MOCK_MESSAGES, MOCK_COMMUNITIES } from '../data/mockData';

function Avatar({
  initials,
  size = 44,
  color = COLORS.purpleMuted,
  showDot = false,
  dotColor = COLORS.green,
}: {
  initials: string;
  size?: number;
  color?: string;
  showDot?: boolean;
  dotColor?: string;
}) {
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: COLORS.white, fontSize: size * 0.33, fontWeight: '700' }}>
          {initials}
        </Text>
      </View>
      {showDot && (
        <View
          style={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            width: 11,
            height: 11,
            borderRadius: 6,
            backgroundColor: dotColor,
            borderWidth: 2,
            borderColor: COLORS.bg,
          }}
        />
      )}
    </View>
  );
}

function ChatModal({ contact, onClose, initialHistory }: { contact: any; onClose: (history: any[]) => void; initialHistory: any[] }) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState(initialHistory);

  const send = () => {
    if (!message.trim()) return;
    const updatedHistory = [...chatHistory, { id: String(Date.now()), from: 'me', text: message.trim() }];
    setChatHistory(updatedHistory);
    setMessage('');
  };

  const handleClose = () => {
    onClose(chatHistory);
  };

  return (
    <Modal visible animationType="slide">
      <SafeAreaView style={styles.chatSafe}>
        <StatusBar barStyle="light-content" />
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Avatar initials={contact.username.slice(0, 2).toUpperCase()} size={36} />
          <Text style={styles.chatName}>{contact.username}</Text>
        </View>

        <ScrollView style={styles.chatScroll} contentContainerStyle={{ padding: 16, gap: 10 }}>
          {chatHistory.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.bubble,
                msg.from === 'me' ? styles.bubbleMe : styles.bubbleThem,
              ]}
            >
              <Text style={[
                styles.bubbleText,
                msg.from === 'me' ? styles.bubbleTextMe : styles.bubbleTextThem,
              ]}>
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.chatInput}>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Message..."
              placeholderTextColor={COLORS.grey}
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, !message.trim() && styles.sendBtnOff]}
              onPress={send}
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

export default function ConnectScreen() {
  const [messages, setMessages] = useState(MOCK_MESSAGES.map(msg => ({
    ...msg,
    chatHistory: [{ id: '0', from: 'them', text: msg.preview }],
  })));
  const [openChat, setOpenChat] = useState<any>(null);

  const handleCloseChatModal = (updatedHistory: any[]) => {
    if (!openChat) return;
    
    const lastMessage = updatedHistory[updatedHistory.length - 1];
    setMessages(prev =>
      prev.map(m => 
        m.id === openChat.id 
          ? { 
              ...m, 
              preview: lastMessage.text, 
              timestamp: 'Just now',
              chatHistory: updatedHistory,
              unread: false
            }
          : m
      )
    );
    setOpenChat(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/*squad*/}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Squad</Text>
          <TouchableOpacity>
            <Text style={styles.moreLink}>More →</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.squadRow}>
          {MOCK_SQUAD.map(member => (
            <TouchableOpacity key={member.id} style={styles.squadItem}>
              <Avatar
                initials={member.username.slice(0, 2).toUpperCase()}
                size={84}
                showDot={member.active}
              />
              <Text style={styles.squadName}>{member.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/*messages*/}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Message →</Text>
        </View>

        <View style={styles.card}>
          {messages.map((msg, i) => (
            <TouchableOpacity
              key={msg.id}
              style={[styles.msgRow, i < messages.length - 1 && styles.msgRowBorder]}
              onPress={() => setOpenChat(msg)}
            >
              <Avatar
                initials={msg.username.slice(0, 2).toUpperCase()}
                size={46}
                showDot={msg.unread}
                dotColor={COLORS.purple}
              />
              <View style={styles.msgText}>
                <Text style={styles.msgUsername}>{msg.username}</Text>
                <Text style={styles.msgPreview} numberOfLines={1}>{msg.preview}</Text>
              </View>
              <View style={styles.msgRight}>
                <Text style={styles.msgTime}>{msg.timestamp}</Text>
                {msg.unread && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/*communities*/}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Communities:</Text>
        </View>

        <View style={styles.communitiesRow}>
          {MOCK_COMMUNITIES.map(c => (
            <TouchableOpacity key={c.id} style={styles.communityCard}>
              <View style={styles.communityLogo}>
                <Text style={styles.communityLogoText}>{c.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <Text style={styles.communityName}>{c.name}</Text>
              <Text style={styles.communityTag}>{c.tag}</Text>
              <Text style={styles.communityMembers}>{c.members} members</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {openChat && <ChatModal contact={openChat} onClose={handleCloseChatModal} initialHistory={openChat.chatHistory} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, paddingHorizontal: 16 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.purple,
    fontSize: 32,
    fontWeight: '800',
  },
  moreLink: { color: COLORS.purpleLight, fontSize: 14, fontWeight: '600' },

  squadRow: { marginLeft: -4 },
  squadItem: { alignItems: 'center', marginRight: 24, marginLeft: 4 },
  squadName: { color: COLORS.grey, fontSize: 11, marginTop: 8, fontWeight: '600' },

  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  msgRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  msgText: { flex: 1 },
  msgUsername: { color: COLORS.white, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  msgPreview: { color: COLORS.grey, fontSize: 13 },
  msgRight: { alignItems: 'flex-end', gap: 6 },
  msgTime: { color: COLORS.grey, fontSize: 11 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.purple,
  },

  communitiesRow: { flexDirection: 'row', gap: 12 },
  communityCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  communityLogo: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  communityLogoText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  communityName: { color: COLORS.white, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  communityTag: {
    color: COLORS.purpleLight,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  communityMembers: { color: COLORS.grey, fontSize: 11 },

  // Chat modal
  chatSafe: { flex: 1, backgroundColor: COLORS.bg },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  chatName: { color: COLORS.white, fontSize: 16, fontWeight: '700', flex: 1 },
  chatScroll: { flex: 1 },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMe: {
    backgroundColor: COLORS.purple,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: COLORS.bgCard,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextMe: { color: COLORS.white },
  bubbleTextThem: { color: COLORS.greyLight },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: COLORS.white,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnOff: { opacity: 0.4 },
});
