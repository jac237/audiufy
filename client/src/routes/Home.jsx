/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ellipsis from 'text-ellipsis';
import approx from 'approximate-number';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import NavigationIcon from '@material-ui/icons/Navigation';
import styled from 'styled-components';
import featuredArtists from '../data/featuredArtistsIds';
import { useQuery } from '@apollo/client';
import { USER_BY_ID } from '../graphql';

const MAX_BIO_LENGTH = 80;

export default function Home() {
  return (
    <div style={{ paddingBottom: 100 }}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          backgroundColor: 'black',
          backgroundImage: `url(/images/bg-image.png)`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          minHeight: 500,
          maxHeight: 600,
        }}
      >
        <Grid
          container
          alignItems="center"
          direction="column"
          spacing={3}
          style={{ color: 'white', padding: 20, margin: 0 }}
        >
          <Grid item>
            <Typography variant="inherit" component="h1" align="center">
              Find your Top{' '}
              <span style={{ color: 'rgb(31, 234, 102)' }}>Spotify</span>{' '}
              Artists on{' '}
              <AudiusLink
                target="_blank"
                rel="noreferrer noopener"
                href="https://audius.co/jessie"
                style={{
                  color: 'white',
                }}
              >
                Audius.co
              </AudiusLink>
            </Typography>
          </Grid>

          <Grid item>
            <Typography
              variant="inherit"
              align="center"
              component="div"
              style={{ fontSize: '1rem', color: 'whitesmoke' }}
            >
              Re-discover your favorite artists — and discover new artists
              already on the decentralized music platform.
            </Typography>
          </Grid>

          <Grid item>
            <SignInButton href="http://audiufy-api.vercel.app/api/v1/spotify/login">
              Sign In
            </SignInButton>
          </Grid>

          <Grid item>
            <Typography variant="inherit" component="h2" align="center">
              Featured Artists on Audius
            </Typography>

            <div
              className="bounce"
              style={{
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 10,
              }}
            >
              <NavigationIcon
                style={{
                  transform: 'rotate(-180deg)',
                  fontSize: 30,
                }}
              />
            </div>
          </Grid>
        </Grid>
      </div>

      <Container maxWidth="lg" style={{ marginTop: '-100px' }}>
        {featuredArtists.map((artist) => (
          <FeaturedArtist artist={artist} key={artist.id} />
        ))}
      </Container>
    </div>
  );
}

const FeaturedArtist = ({ artist }) => {
  const { loading, error, data: artistResult } = useQuery(USER_BY_ID, {
    variables: { userId: artist.id },
  });

  if (loading) console.log(`Loading results for: ${artist.name}`);
  if (error) console.log(`${artist.name}: ${error.message}`);
  if (artistResult) console.log(artistResult);
  if (!artistResult?.getUserById) return null;

  return (
    <RowCard variant="outlined">
      <Grid container>
        <Grid
          item
          xs={12}
          sm={6}
          md={5}
          style={{
            backgroundImage: `url(${artistResult.getUserById.cover_photo.x2000})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minHeight: 120,
          }}
        />

        <Grid
          item
          container
          xs={12}
          sm={6}
          md={7}
          style={{
            padding: 20,
            paddingBottom: 30,
            borderRight: '1px solid rgb(231, 235, 238, 0.4)',
          }}
        >
          <Grid item>
            <a
              alt={`${artistResult.getUserById.name} | Audius`}
              title={`${artistResult.getUserById.name} | Audius`}
              href={`https://audius.co/${artistResult.getUserById.handle}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <UserAvatar
                src={artistResult.getUserById.profile_picture.x150}
                style={{
                  width: 100,
                  height: 100,
                  marginRight: 16,
                  marginBottom: 6,
                }}
              />
            </a>
          </Grid>

          <Grid item className="artist-information" xs>
            <Typography variant="inherit" component="h2">
              {artistResult.getUserById.name}
            </Typography>

            <Typography
              variant="subtitle2"
              color="textSecondary"
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              @{artistResult.getUserById.handle}{' '}
              {artistResult.getUserById.is_verified ? (
                <CheckCircleIcon
                  style={{
                    paddingLeft: 4,
                    fontSize: 16,
                    color: '#cc0fe0',
                  }}
                />
              ) : null}
            </Typography>

            <Typography variant="subtitle2" component="p" gutterBottom>
              {ellipsis(artistResult.getUserById.bio, MAX_BIO_LENGTH)}
            </Typography>

            <Grid container spacing={1} className="artists-statistics">
              <Grid item>
                <Typography
                  variant="subtitle2"
                  style={{ color: 'rgba(0, 0, 0, 0.54)' }}
                >
                  <span style={{ fontWeight: 'bold', color: 'rgb(40,40,40)' }}>
                    {artistResult.getUserById.track_count}
                  </span>{' '}
                  tracks
                </Typography>
              </Grid>

              <Grid item>
                <Typography
                  variant="subtitle2"
                  style={{ color: 'rgba(0, 0, 0, 0.54)' }}
                >
                  <span style={{ fontWeight: 'bold', color: 'rgb(40,40,40)' }}>
                    {approx(artistResult.getUserById.follower_count)}
                  </span>{' '}
                  followers
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </RowCard>
  );
};

const RowCard = styled(Paper)`
  border: none;
  border-bottom: 1px solid rgb(231, 235, 238);
  border-radius: 10px;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  overflow: hidden;

  :hover {
    box-shadow: rgb(0 0 0 / 12%) 0px 8px 24px;
    transform: scale(0.97);
  }
`;

const UserAvatar = styled(Avatar)`
  transition: all 0.2s ease-in-out;

  :hover {
    transform: scale(1.1);
  }
`;

const SignInButton = styled.a`
  display: flex;
  width: 100vw;
  max-width: 300px;
  font-weight: 500;
  text-decoration: none;
  justify-content: center;
  background: rgb(0, 0, 0, 0.3);
  border: 1px solid whitesmoke;
  color: #f1f1f1;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;

  :hover {
    transform: scale(1.1);
    border: 1px solid rgb(14 210 82);
    background: rgb(14 210 82);
    color: black;
    font-weight: 600;
  }
`;

const AudiusLink = styled.a`
  display: inline-block;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  :hover {
    transform: scale(1.05);
    text-decoration: underline;
  }
`;
