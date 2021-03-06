// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, useCallback, ComponentProps, useMemo} from 'react';
import {FormattedMessage} from 'react-intl';

import './thread_footer.scss';

import Avatars from 'components/widgets/users/avatars';

import Button from 'components/threading/common/button';
import FollowButton from 'components/threading/common/follow_button';

import Timestamp from 'components/timestamp';
import SimpleTooltip from 'components/widgets/simple_tooltip';

import {THREADING_TIME} from '../../common/options';

type Props = {
    participants: Array<{id: string}>; // Post['participants']
    totalParticipants?: number;
    totalReplies: number;
    newReplies: number;
    lastReplyAt: ComponentProps<typeof Timestamp>['value'];
    isFollowing: boolean;
    actions: {
        setFollowing: (isFollowing: boolean) => void;
        openThread: () => void;
    };
};

function ThreadFooter({
    participants,
    totalParticipants,
    totalReplies = 0,
    newReplies = 0,
    lastReplyAt,
    isFollowing,
    actions: {
        setFollowing,
        openThread,
    },
}: Props) {
    const participantIds = useMemo(() => participants?.map(({id}) => id), [participants]);

    return (
        <div className='ThreadFooter'>
            {newReplies ? (
                <SimpleTooltip
                    id='threadFooterIndicator'
                    content={
                        <FormattedMessage
                            id='threading.numNewMessages'
                            defaultMessage='{newReplies, plural, =0 {no unread messages} =1 {one unread message} other {# unread messages}}'
                            values={{newReplies}}
                        />
                    }
                >
                    <div
                        className='indicator'
                        tabIndex={0}
                    >
                        <div className='dot-unreads'/>
                    </div>
                </SimpleTooltip>
            ) : (
                <div className='indicator'/>
            )}

            <Avatars
                userIds={participantIds}
                totalUsers={totalParticipants}
                size='sm'
            />

            <Button
                onClick={openThread}
                className='separated'
                prepend={
                    <span className='icon'>
                        <i className='icon-reply-outline'/>
                    </span>
                }
            >
                <FormattedMessage
                    id='threading.numReplies'
                    defaultMessage='{totalReplies, plural, =0 {Reply} =1 {# reply} other {# replies}}'
                    values={{totalReplies}}
                />
            </Button>

            <FollowButton
                isFollowing={isFollowing}
                className='separated'
                onClick={useCallback(() => {
                    setFollowing(!isFollowing);
                }, [setFollowing, isFollowing])}
            />

            {Boolean(lastReplyAt) && (
                <Timestamp
                    value={lastReplyAt}
                    {...THREADING_TIME}
                >
                    {({formatted}) => (
                        <span className='Timestamp separated alt-visible'>
                            <FormattedMessage
                                id='threading.footer.lastReplyAt'
                                defaultMessage='Last reply {formatted}'
                                values={{formatted}}
                            />
                        </span>
                    )}
                </Timestamp>
            )}
        </div>
    );
}

export default memo(ThreadFooter);
