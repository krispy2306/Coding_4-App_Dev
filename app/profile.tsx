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
import { COLORS, MOCK_PROFILE, MOCK_POSTS } from '../data/mockData';

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBadge}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function EditModal({
  profile,
  onSave,
  onClose,
}: {
  profile: any;
  onSave: (p: any) => void;
  onClose: () => void;
}) {
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [team, setTeam] = useState(profile.team);
  const [discord, setDiscord] = useState(profile.discord);
  const [twitch, setTwitch] = useState(profile.twitch);

  return (
    <Modal visible animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {[
              { label: 'Username', value: username, setter: setUsername, placeholder: 'Your username' },
              { label: 'Bio', value: bio, setter: setBio, placeholder: 'Tell the community about yourself', multi: true },
              { label: 'Team', value: team, setter: setTeam, placeholder: 'Your team name' },
              { label: 'Discord', value: discord, setter: setDiscord, placeholder: 'user#1234' },
              { label: 'Twitch', value: twitch, setter: setTwitch, placeholder: 'Your Twitch handle' },
            ].map(field => (
              <View key={field.label} style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <TextInput
                  style={[styles.fieldInput, field.multi && styles.fieldInputMulti]}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor={COLORS.grey}
                  multiline={field.multi}
                />
              </View>
            ))}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => {
                  onSave({ ...profile, username, bio, team, discord, twitch });
                  onClose();
                }}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [editing, setEditing] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const myPosts = MOCK_POSTS.slice(0, 2);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />


      <View style={styles.topBar}>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => setEditing(true)}>
          <Ionicons name="settings-outline" size={22} color={COLORS.greyLight} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/*main profile header*/}
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatarLarge} onPress={() => setEditing(true)}>
            <Text style={styles.avatarLargeText}>
              {profile.username.slice(0, 2).toUpperCase()}
            </Text>
            <View style={styles.avatarEditOverlay}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </View>
          </TouchableOpacity>

          <View style={styles.profileRight}>
            {profile.team ? (
              <View style={styles.teamBadge}>
                <View style={styles.teamAvatarSmall}>
                  <Text style={styles.teamAvatarText}>{profile.team.slice(0, 2).toUpperCase()}</Text>
                </View>
                <Text style={styles.teamName}>{profile.team}</Text>
              </View>
            ) : null}

            <View style={styles.socialLinks}>
              {profile.discord && (
                <View style={styles.socialChip}>
                  <Ionicons name="logo-discord" size={14} color={COLORS.grey} />
                </View>
              )}
              {profile.twitch && (
                <View style={styles.socialChip}>
                  <Ionicons name="tv-outline" size={14} color={COLORS.grey} />
                </View>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.username}>{profile.username}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>

        <TouchableOpacity style={styles.editProfileBtn} onPress={() => setEditing(true)}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        {/*stats*/}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{profile.stats.rank}</Text>
            </View>
            <StatBadge label="Matches" value={String(profile.stats.matches)} />
            <StatBadge label="Win Rate" value={profile.stats.winRate} />
            <StatBadge label="K/D" value={profile.stats.kd} />
          </View>
        </View>

        {/*posts*/}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Posts →</Text>
        </View>

        {myPosts.map(post => (
          <TouchableOpacity
            key={post.id}
            style={styles.postCard}
            onPress={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
          >
            <View style={styles.postTop}>
              <View>
                <Text style={styles.postUsername}>{profile.username}</Text>
                <Text style={styles.postGame}>{post.game}</Text>
              </View>
              <Ionicons
                name={expandedPost === post.id ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={COLORS.grey}
              />
            </View>
            <Text style={styles.postContent} numberOfLines={expandedPost === post.id ? 0 : 2}>
              {post.content}
            </Text>
          </TouchableOpacity>
        ))}

        {/*achievements*/}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements →</Text>
        </View>

        <View style={styles.achievementsList}>
          {profile.achievements.map(a => (
            <View key={a.id} style={styles.achievementCard}>
              <View style={styles.achievementIcon}>
                <Ionicons name="trophy" size={18} color={COLORS.purple} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.achievementTitle}>{a.title}</Text>
                <Text style={styles.achievementDate}>{a.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {editing && (
        <EditModal
          profile={profile}
          onSave={setProfile}
          onClose={() => setEditing(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, paddingHorizontal: 16 },

  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingsBtn: { padding: 4 },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 14,
    gap: 16,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.purple,
  },
  avatarLargeText: { color: COLORS.white, fontSize: 28, fontWeight: '800' },
  avatarEditOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRight: { flex: 1, paddingTop: 8, gap: 12 },
  teamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  teamAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarText: { color: COLORS.white, fontSize: 10, fontWeight: '800' },
  teamName: { color: COLORS.greyLight, fontSize: 13, fontWeight: '600' },
  socialLinks: { flexDirection: 'row', gap: 8 },
  socialChip: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  username: { color: COLORS.white, fontSize: 36, fontWeight: '900', letterSpacing: -0.5, marginBottom: 6 },
  bio: { color: COLORS.grey, fontSize: 14, lineHeight: 20, marginBottom: 16 },

  editProfileBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  editProfileText: { color: COLORS.greyLight, fontSize: 14, fontWeight: '600' },

  //stats
  statsSection: {
    backgroundColor: COLORS.purple,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statsTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800', marginBottom: 14 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rankText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  statBadge: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  statValue: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },

  //posts
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { color: COLORS.purple, fontSize: 32, fontWeight: '800' },

  postCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  postTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  postUsername: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  postGame: { color: COLORS.grey, fontSize: 12, marginTop: 2 },
  postContent: { color: COLORS.greyLight, fontSize: 13, lineHeight: 20 },


  achievementsList: { gap: 8, marginBottom: 16 },
  achievementCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementTitle: { color: COLORS.greyLight, fontSize: 14, fontWeight: '600' },
  achievementDate: { color: COLORS.grey, fontSize: 12, marginTop: 2 },


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
    maxHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800', marginBottom: 20 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { color: COLORS.grey, fontSize: 12, fontWeight: '600', marginBottom: 6 },
  fieldInput: {
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 12,
    padding: 12,
    color: COLORS.white,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fieldInputMulti: { minHeight: 80, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
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
  saveBtn: {
    flex: 2,
    backgroundColor: COLORS.purple,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
});
