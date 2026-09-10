import React from 'react';
import type { IconType } from 'react-icons';
import {
  FiAlertCircle,
  FiExternalLink,
  FiGitBranch,
  FiGitCommit,
  FiGithub,
  FiGitMerge,
  FiGitPullRequest,
  FiMessageSquare,
  FiPlusSquare,
  FiStar,
  FiTag,
} from 'react-icons/fi';
import { profile } from '../../data/profile';
import useGithubActivity from '../../hooks/useGithubActivity';
import type { ActivityKind } from '../../hooks/useGithubActivity';
import Reveal from '../reveal';
import './index.css';

const icons: Record<ActivityKind, IconType> = {
  push: FiGitCommit,
  pr: FiGitPullRequest,
  merge: FiGitMerge,
  branch: FiGitBranch,
  repo: FiPlusSquare,
  tag: FiTag,
  star: FiStar,
  fork: FiGitBranch,
  release: FiTag,
  issue: FiAlertCircle,
  comment: FiMessageSquare,
};

/** "3 days ago" style label for an ISO timestamp. */
export const relativeTime = (iso: string, now = Date.now()): string => {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ];
  const format =
    typeof Intl !== 'undefined' && 'RelativeTimeFormat' in Intl
      ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
      : null;
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) {
      const value = Math.round(seconds / size);
      return format ? format.format(value, unit) : `${Math.abs(value)} ${unit}s ago`;
    }
  }
  return 'just now';
};

const GITHUB_USER = profile.githubHandle;

/**
 * A short feed of recent public GitHub activity, fetched live. Renders
 * nothing until the API answers and nothing at all if it can't, so the
 * page never shows an empty box.
 */
const GithubActivity = () => {
  const items = useGithubActivity(GITHUB_USER, 5);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Reveal className='card gh-activity'>
      <div className='gh-activity__head'>
        <span className='label gh-activity__label'>
          <FiGithub aria-hidden='true' /> Latest on GitHub
        </span>
        <a
          className='gh-activity__profile'
          href={profile.github}
          target='_blank'
          rel='noopener noreferrer'>
          @{GITHUB_USER} <FiExternalLink aria-hidden='true' />
        </a>
      </div>
      <ol className='gh-activity__list'>
        {items.map(item => {
          const Icon = icons[item.kind];
          const repoName = item.repo.startsWith(`${GITHUB_USER}/`) ? item.repo.slice(GITHUB_USER.length + 1) : item.repo;
          return (
            <li key={item.id} className='gh-activity__item'>
              <span className='gh-activity__icon' aria-hidden='true'>
                <Icon />
              </span>
              <div className='gh-activity__body'>
                <span className='gh-activity__title'>
                  {item.title}{' '}
                  <a href={`https://github.com/${item.repo}`} target='_blank' rel='noopener noreferrer'>
                    {repoName}
                  </a>
                </span>
                {item.detail &&
                  (item.url ? (
                    <a className='gh-activity__detail' href={item.url} target='_blank' rel='noopener noreferrer'>
                      {item.detail}
                    </a>
                  ) : (
                    <span className='gh-activity__detail'>{item.detail}</span>
                  ))}
              </div>
              <time className='gh-activity__time' dateTime={item.at}>
                {relativeTime(item.at)}
              </time>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
};

export default GithubActivity;
