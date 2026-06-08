import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import {
  View,
  Text,
  Image,
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
import {
  COLORS,
  MOCK_POSTS,
  MOCK_SCRIMS,
  MOCK_EVENTS,
  GAME_INTEL,
} from '../data/mockData';

function Avatar({ initials, size = 42, color = COLORS.purpleMuted }: { initials: string; size?: number; color?: string }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

function PostCard({ post, onLike, isLiked }: { post: any; onLike: (id: string) => void; isLiked: boolean }) {
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Avatar initials={post.username.slice(0, 2).toUpperCase()} size={38} />
        <View style={styles.postMeta}>
          <Text style={styles.postUsername}>{post.username}</Text>
          <Text style={styles.postGame}>{post.game} · {post.timestamp}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onLike(post.id)}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={18} color={isLiked ? COLORS.purple : COLORS.grey} />
          <Text style={[styles.actionCount, isLiked && { color: COLORS.purple }]}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={16} color={COLORS.grey} />
          <Text style={styles.actionCount}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ScrimCard({ scrim }: { scrim: any }) {
  return (
    <View style={styles.scrimCard}>
      <Text style={styles.scrimName}>{scrim.name}</Text>
      <View style={styles.scrimTeams}>
        <Text style={styles.teamName}>{scrim.teamA}</Text>
        <Text style={styles.vsText}>VS</Text>
        <Text style={styles.teamName}>{scrim.teamB}</Text>
      </View>
      <Text style={styles.scrimMeta}>{scrim.game} · {scrim.date}</Text>
      <TouchableOpacity
        style={[styles.moreBtn, scrim.status === 'open' && styles.moreBtnOpen]}
      >
        <Text style={styles.moreBtnText}>{scrim.status === 'open' ? 'Join' : 'More'}</Text>
      </TouchableOpacity>
    </View>
  );
}

function EventCard({ event, onMore }: { event: any; onMore: (event: any) => void }) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventGlow} />
      <Text style={styles.eventName}>{event.name}</Text>
      <Text style={styles.eventMeta}>{event.game}</Text>
      <Text style={styles.eventDate}>{event.date}</Text>
      <TouchableOpacity style={styles.moreBtn} onPress={() => onMore(event)}>
        <Text style={styles.moreBtnText}>More</Text>
      </TouchableOpacity>
    </View>
  );
}

function EventDetailModal({ event, onClose }: { event: any; onClose: () => void }) {
  if (!event) return null;

  const mockAttendees = Array.from({ length: Math.min(event.attending || 2, 3) }, (_, i) => ({
    id: `attendee-${i}`,
    initials: ['JD', 'SK', 'MC'][i],
    username: ['johnny_dev', 'skye_king', 'mc_pro'][i],
  }));

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.eventDetailModalOverlay}>
        <View style={styles.eventDetailModalSheet}>
          <View style={styles.eventDetailModalHandle} />
          
          <View style={styles.eventDetailHeader}>
            <Text style={styles.eventDetailTitle}>{event.name}</Text>
            {event.community && <Text style={styles.eventDetailValue}>{event.community}</Text>}
          </View>

          {/* Event Details */}
          <View style={styles.eventDetailsContainer}>
            <View style={styles.eventDetailRow}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.purple} style={styles.eventDetailIcon} />
              <Text style={styles.eventDetailLabel}>Date</Text>
              <Text style={styles.eventDetailValue}>{event.date}</Text>
            </View>

            <View style={styles.eventDetailRow}>
              <Ionicons name="game-controller-outline" size={18} color={COLORS.purple} style={styles.eventDetailIcon} />
              <Text style={styles.eventDetailLabel}>Game</Text>
              <Text style={styles.eventDetailValue}>{event.game}</Text>
            </View>

            <View style={styles.eventDetailRow}>
              <Ionicons name="people-outline" size={18} color={COLORS.purple} style={styles.eventDetailIcon} />
              <Text style={styles.eventDetailLabel}>Players</Text>
              <Text style={styles.eventDetailValue}>{event.players} participants</Text>
            </View>
          </View>

          {/* Description */}
          {event.description && (
            <View style={styles.eventDescriptionSection}>
              <Text style={styles.eventDescriptionTitle}>About</Text>
              <Text style={styles.eventDescriptionText}>{event.description}</Text>
            </View>
          )}

          {/* Attending */}
          {mockAttendees.length > 0 && (
            <View style={styles.eventAttendingSection}>
              <Text style={styles.eventAttendingSectionTitle}>Friends Attending ({mockAttendees.length})</Text>
              <View style={styles.eventAttendeesList}>
                {mockAttendees.map(attendee => (
                  <View key={attendee.id} style={styles.eventAttendeeAvatarWrapper}>
                    <View style={styles.eventAttendeeAvatar}>
                      <Text style={styles.eventAttendeeAvatarText}>{attendee.initials}</Text>
                    </View>
                    <Text style={styles.eventAttendeeUsername}>{attendee.username}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <TouchableOpacity style={styles.eventJoinBtn}>
            <Text style={styles.eventJoinBtnText}>Register Interest</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.eventCloseBtn} onPress={onClose}>
            <Text style={styles.eventCloseBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function LobbyScreen() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [modalVisible, setModalVisible] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [selectedGame, setSelectedGame] = useState('Valorant');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const GAMES = ['Valorant', 'CS2', 'Rocket League', 'Overwatch 2', 'Other'];

  const handleLike = (id: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        setPosts(prevPosts =>
          prevPosts.map(p => p.id === id ? { ...p, likes: p.likes - 1 } : p)
        );
      } else {
        newSet.add(id);
        setPosts(prevPosts =>
          prevPosts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p)
        );
      }
      return newSet;
    });
  };

  const handlePost = () => {
    if (!newPostText.trim()) return;
    const newPost = {
      id: String(Date.now()),
      username: 'YourUsername',
      avatar: null,
      game: selectedGame,
      content: newPostText.trim(),
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
    };
    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />


      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Image
            source={require('../assets/logoDepth.png')}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>scrimble</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.greyLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={22} color={COLORS.greyLight} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/*lobby*/}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Lobby</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={36} color={COLORS.purple} />
          </TouchableOpacity>
        </View>

        {/*latest updates*/}
        <Text style={styles.subSectionTitle}>Latest Updates:</Text>
        <View style={styles.postsContainer}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onLike={handleLike} isLiked={likedPosts.has(post.id)} />
          ))}
        </View>

        {/*coming up*/}
        <Text style={styles.subSectionTitle}>Coming Up:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {MOCK_SCRIMS.map(scrim => (
            <ScrimCard key={scrim.id} scrim={scrim} />
          ))}
          {MOCK_EVENTS.map(event => (
            <EventCard key={event.id} event={event} onMore={setSelectedEvent} />
          ))}
        </ScrollView>

        {/*game intel*/}
        <Text style={styles.subSectionTitle}>Game Intel:</Text>
        <View style={styles.intelContainer}>
          {GAME_INTEL.map(item => (
            <TouchableOpacity key={item.id} style={styles.intelCard}>
              <View style={styles.intelDot} />
              <View style={styles.intelText}>
                <Text style={styles.intelTitle}>{item.title}</Text>
                <Text style={styles.intelMeta}>{item.source} · {item.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.grey} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/*posting*/}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>New Post</Text>

            <TextInput
              style={styles.postInput}
              placeholder="What's happening in your lobby?"
              placeholderTextColor={COLORS.grey}
              multiline
              maxLength={280}
              value={newPostText}
              onChangeText={setNewPostText}
              autoFocus
            />

            <Text style={styles.gameLabel}>Game</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamePicker}>
              {GAMES.map(g => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setSelectedGame(g)}
                  style={[styles.gameChip, selectedGame === g && styles.gameChipActive]}
                >
                  <Text style={[styles.gameChipText, selectedGame === g && styles.gameChipTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.postBtn, !newPostText.trim() && styles.postBtnDisabled]}
                onPress={handlePost}
                disabled={!newPostText.trim()}
              >
                <Text style={styles.postBtnText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, paddingHorizontal: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoS: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: COLORS.white, fontSize: 18, fontWeight: '900' },
  brandName: { 
    color: COLORS.white, 
    fontSize: 18, 
    fontFamily: 'ZenDots_400Regular',
    letterSpacing: 1 
  },
  headerIcons: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 6 },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    color: COLORS.purple,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subSectionTitle: {
    color: COLORS.purple,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },


  postsContainer: { gap: 10 },
  postCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  postMeta: { flex: 1 },
  postUsername: { color: COLORS.white, fontSize: 14, fontFamily: 'Inter_700Bold' },
  postGame: { color: COLORS.grey, fontSize: 12, marginTop: 1 },
  postContent: { color: COLORS.greyLight, fontSize: 14, lineHeight: 20 },
  postActions: { flexDirection: 'row', gap: 16, marginTop: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionCount: { color: COLORS.grey, fontSize: 13 },


  avatar: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.white, fontWeight: '700' },

  //scrims and events
  horizontalScroll: { marginLeft: -4 },
  scrimCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    marginLeft: 4,
    width: 180,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scrimName: { color: COLORS.grey, fontSize: 11, fontWeight: '600', marginBottom: 8 },
  scrimTeams: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8, gap: 8 },
  teamName: { color: COLORS.white, fontSize: 13, fontWeight: '700', flex: 1, textAlign: 'center' },
  vsText: { color: COLORS.purple, fontSize: 18, fontWeight: '900' },
  scrimMeta: { color: COLORS.grey, fontSize: 11, marginBottom: 12 },
  moreBtn: {
    backgroundColor: COLORS.purple,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  moreBtnOpen: { backgroundColor: COLORS.green },
  moreBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  eventCard: {
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 14,
    padding: 14,
    marginRight: 12,
    width: 160,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.purpleMuted,
  },
  eventGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.purple,
    opacity: 0.25,
    right: -20,
    top: -20,
  },
  eventName: { color: COLORS.white, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  eventMeta: { color: COLORS.grey, fontSize: 11, marginBottom: 2 },
  eventDate: { color: COLORS.purpleLight, fontSize: 11, fontWeight: '600', marginBottom: 12 },

  //game intel
  intelContainer: { gap: 8 },
  intelCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  intelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.purple,
  },
  intelText: { flex: 1 },
  intelTitle: { color: COLORS.greyLight, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  intelMeta: { color: COLORS.grey, fontSize: 11, marginTop: 2 },

  
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalSheet: {
    backgroundColor: '#1A1528',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  postInput: {
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 12,
    padding: 14,
    color: COLORS.white,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  gameLabel: { color: COLORS.grey, fontSize: 13, fontWeight: '600', marginBottom: 8 },
  gamePicker: { marginBottom: 20 },
  gameChip: {
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  gameChipActive: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  gameChipText: { color: COLORS.grey, fontSize: 13, fontWeight: '600' },
  gameChipTextActive: { color: COLORS.white },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelText: { color: COLORS.grey, fontSize: 15, fontWeight: '700' },
  postBtn: {
    flex: 2,
    backgroundColor: COLORS.purple,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  postBtnDisabled: { opacity: 0.4 },
  postBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  

  eventDetailModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  eventDetailModalSheet: {
    backgroundColor: '#1A1528',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  eventDetailModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  eventDetailHeader: {
    marginBottom: 24,
  },
  eventDetailTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  eventDetailsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventDetailIcon: {
    color: COLORS.purple,
    minWidth: 20,
  },
  eventDetailLabel: {
    color: COLORS.grey,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  eventDetailValue: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    flex: 2,
  },
  eventDescriptionSection: {
    marginBottom: 24,
  },
  eventDescriptionTitle: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  eventDescriptionText: {
    color: COLORS.greyLight,
    fontSize: 13,
    lineHeight: 20,
  },
  eventAttendingSection: {
    marginBottom: 24,
  },
  eventAttendingSectionTitle: {
    color: COLORS.purple,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  eventAttendeesList: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  eventAttendeeAvatarWrapper: {
    alignItems: 'center',
  },
  eventAttendeeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventAttendeeAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  eventAttendeeUsername: {
    color: COLORS.greyLight,
    fontSize: 11,
    textAlign: 'center',
  },
  eventJoinBtn: {
    backgroundColor: COLORS.purple,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  eventJoinBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  eventCloseBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventCloseBtnText: {
    color: COLORS.greyLight,
    fontSize: 15,
    fontWeight: '600',
  },
});
