import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import type { FlashCard } from '../types';
import { AppButton } from '../components/AppButton';
import { FlipCard } from '../components/FlipCard';
import { GlassPanel } from '../components/GlassPanel';
import { theme } from '../theme';

type Props = {
  autoNextProgress: number;
  currentCard: FlashCard;
  currentIndex: number;
  isFlipped: boolean;
  progress: number;
  total: number;
  onFlip: () => void;
  onHome: () => void;
  onListen: () => void;
  onNext: () => void;
};

export function StudyScreen({
  autoNextProgress,
  currentCard,
  currentIndex,
  isFlipped,
  progress,
  total,
  onFlip,
  onHome,
  onListen,
  onNext,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <GlassPanel style={styles.topBar}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{currentCard.broadcat}</Text>
            <Text style={styles.headerSubtitle}>{currentCard.cat}</Text>
          </View>
          <View style={styles.positionPill}>
            <Text style={styles.positionText}>{currentIndex + 1} / {total}</Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </GlassPanel>

      <View style={styles.cardWrap}>
        <FlipCard autoNextProgress={autoNextProgress} card={currentCard} flipped={isFlipped} onPress={onFlip} />
      </View>

      <GlassPanel style={styles.actionPanel}>
        <View style={styles.actionRow}>
          <AppButton title="Listen" onPress={onListen} style={styles.flexOne} />
          <AppButton title="Flip" variant="primary" onPress={onFlip} style={styles.flexOne} />
          <AppButton title="Next" onPress={onNext} style={styles.flexOne} />
        </View>
      </GlassPanel>

      <Pressable
        onPress={() =>
          Alert.alert('Quit session', 'Are you sure you want to quit and return to home?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: onHome },
          ])
        }
        style={styles.quitButton}
      >
        <Text style={styles.quitText}>Quit to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  topBar: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: theme.colors.muted,
    marginTop: 4,
    fontSize: 13,
  },
  positionPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  positionText: {
    color: theme.colors.text,
    fontWeight: '700',
    fontSize: 12,
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  cardWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  actionPanel: {
    padding: 12,
  },
  actionRow: {
    gap: 8,
  },
  flexOne: {
    width: '100%',
  },
  quitButton: {
    minHeight: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  quitText: {
    color: theme.colors.text,
    fontWeight: '700',
  },
});
