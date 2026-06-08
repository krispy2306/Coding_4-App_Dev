import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, MOCK_EXPLORE } from '../data/mockData';

const FILTERS = ['All', 'Games', 'Tournament', 'Players'];

function ExploreCard({ item, onPress }: { item: any; onPress: () => void }) {
  const isTournament = item.type === 'tournament';
  return (
    <View style={styles.card}>
      <View style={[styles.logoBox, isTournament ? styles.logoTournament : styles.logoPlayer]}>
        <Ionicons
          name={isTournament ? 'trophy-outline' : 'person-outline'}
          size={24}
          color={COLORS.white}
        />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardGame}>{item.game}</Text>
        {item.date && <Text style={styles.cardDate}>{item.date}</Text>}
        <View style={styles.cardPlayers}>
          <Ionicons name="people-outline" size={13} color={COLORS.grey} />
          <Text style={styles.cardPlayersText}>{item.players} {item.type === 'player' ? 'needed' : 'Players'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreBtn} onPress={onPress}>
        <Text style={styles.moreBtnText}>more</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailModal({ item, onClose }: { item: any; onClose: () => void }) {
  if (!item) return null;

  const mockMembers = Array.from({ length: 3 }, (_, i) => ({
    id: `member-${i}`,
    initials: ['JD', 'SK', 'MC'][i],
    username: ['johnny_dev', 'skye_king', 'mc_pro'][i],
  }));

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          
          <View style={styles.modalHeader}>
            <View style={[styles.modalLogo, item.type === 'tournament' ? styles.logoTournament : styles.logoPlayer]}>
              <Ionicons
                name={item.type === 'tournament' ? 'trophy-outline' : 'person-outline'}
                size={32}
                color={COLORS.white}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>{item.name}</Text>
              <Text style={styles.modalGame}>{item.game}</Text>
            </View>
          </View>

          <View style={styles.hostSection}>
            <Text style={styles.hostSectionTitle}>Host</Text>
            <Text style={styles.hostUsername}>{item.name}</Text>
          </View>

          {item.date && (
            <View style={styles.modalRow}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.grey} />
              <Text style={styles.modalRowText}>{item.date}</Text>
            </View>
          )}
          <View style={styles.modalRow}>
            <Ionicons name="people-outline" size={16} color={COLORS.grey} />
            <Text style={styles.modalRowText}>{item.players} {item.type === 'player' ? 'needed' : 'Players registered'}</Text>
          </View>

          <Text style={styles.modalDesc}>{item.description}</Text>

          {/*mutuals*/}
          {!item.type || item.type === 'tournament' ? (
            <View style={styles.membersSection}>
              <Text style={styles.membersSectionTitle}>Members you know</Text>
              <View style={styles.membersList}>
                {mockMembers.map(member => (
                  <TouchableOpacity key={member.id} style={styles.memberAvatarWrapper}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.avatarText}>{member.initials}</Text>
                    </View>
                    <Text style={styles.memberUsername}>{member.username}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}

          <TouchableOpacity style={styles.joinBtn}>
            <Text style={styles.joinBtnText}>{item.type === 'player' ? 'Message Player' : 'Register / Join'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}




export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selected, setSelected] = useState<any>(null);

  const filtered = MOCK_EXPLORE.filter(item => {
    const matchSearch =
      search === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.game.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Games' && item.type === 'tournament') ||
      (activeFilter === 'Players' && item.type === 'player') ||
      (activeFilter === 'Tournament' && item.type === 'tournament');

    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logoDepth.png')}
          style={{ width: 43, height: 43 }}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.exploreTitle}>New Games, New Friends</Text>

      {/* Search */}
      <View style={styles.searchRow}>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="menu" size={22} color={COLORS.grey} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={COLORS.grey}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" size={18} color={COLORS.grey} />
        </View>
      </View>

      {/*filters*/}
      <View style={styles.filtersRow}>
        <Ionicons name="filter" size={16} color={COLORS.grey} style={{ marginRight: 8 }} />
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/*results*/}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.cardList}>
          {filtered.length > 0 ? (
            filtered.map(item => (
              <ExploreCard key={item.id} item={item} onPress={() => setSelected(item)} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={40} color={COLORS.grey} />
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          )}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>

      {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, paddingHorizontal: 16 },

  exploreTitle: {
    color: COLORS.purple,
    fontSize: 32,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    letterSpacing: -0.5,
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoS: {
    width: 43,
    height: 43,
    borderRadius: 8,
    backgroundColor: COLORS.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: COLORS.white, fontSize: 18, fontWeight: '900' },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  menuBtn: { padding: 4 },
  searchBox: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 15,
    marginRight: 8,
  },

  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: { backgroundColor: COLORS.purple, borderColor: COLORS.purple },
  filterText: { color: COLORS.grey, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: COLORS.white },

  cardList: { gap: 10 },
  card: {
    backgroundColor: '#241245',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#885FAD',
    borderWidth: 0,
  },
  logoTournament: {},
  logoPlayer: {},
  cardInfo: { flex: 1 },
  cardName: { color: COLORS.purple, fontSize: 14, fontWeight: '700', marginBottom: 2 },
  cardGame: { color: COLORS.white, fontSize: 12, marginBottom: 2 },
  cardDate: { color: COLORS.white, fontSize: 12, marginBottom: 4 },
  cardPlayers: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardPlayersText: { color: COLORS.grey, fontSize: 12 },

  moreBtn: {
    backgroundColor: COLORS.purple,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  moreBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: COLORS.grey, fontSize: 16 },

  
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.65)',
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
    marginBottom: 20,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  modalLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  modalGame: { color: COLORS.grey, fontSize: 14, marginTop: 2 },
  
  hostSection: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  hostSectionTitle: { color: COLORS.grey, fontSize: 12, fontWeight: '600', marginBottom: 4 },
  hostUsername: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  modalRowText: { color: COLORS.greyLight, fontSize: 14 },
  modalDesc: {
    color: COLORS.grey,
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  membersSection: { marginBottom: 16, paddingBottom: 0, borderBottomWidth: 0 },
  membersSectionTitle: { color: COLORS.purple, fontSize: 14, fontWeight: '800', marginBottom: 12 },
  membersList: { flexDirection: 'row', justifyContent: 'space-around', gap: 12 },
  memberAvatarWrapper: { alignItems: 'center', flex: 1 },
  memberAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.purpleMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.purple,
    marginBottom: 6,
  },
  avatarText: { color: COLORS.white, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  memberUsername: { color: COLORS.greyLight, fontSize: 10, fontWeight: '600', textAlign: 'center' },
  joinBtn: {
    backgroundColor: COLORS.purple,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  joinBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  closeBtn: {
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  closeBtnText: { color: COLORS.grey, fontSize: 15, fontWeight: '600' },
});
