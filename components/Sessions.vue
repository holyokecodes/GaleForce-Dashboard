<template>
    <div>
        <c-grid w="100%" template-columns="repeat(2, 1fr)" gap="10" mt="4" py="8">
            <c-box w="100%">
                <c-heading as="h2" size="lg" mb="2" textTransform="uppercase">
                    Session
                </c-heading>
                <c-form-control max-width="240px">
                    <c-select 
                        id="active-session" 
                        v-model="session.session_code"
                        placeholder="Select session"
                        variant="filled"
                        @change="(val) => selectSession(val)">
                        <option 
                            v-for="session in sessions" 
                            v-bind:key="session.code" 
                            :value="session.code">
                            {{ session.code }}
                        </option>
                    </c-select>
                </c-form-control>
                <c-button mt="4" variant-color="blue" @click="newSession()">New Session</c-button>
            </c-box>
            <c-box v-if="session.id" w="100%">
                <c-heading as="h2" size="lg" mb="2" textTransform="uppercase">
                    Session Settings
                </c-heading>
                <c-form-control>
                    <c-form-label html-for="mute">Mute all players</c-form-label>
                    <c-switch id="mute" :is-checked="session.mute" @change="(val, $e) => mutePlayers(val, $e)"/>
                </c-form-control>
                <c-form-control>
                    <c-form-label html-for="unlock_map">Unlock map</c-form-label>
                    <c-switch id="unlock_map" :is-checked="session.unlock_map" @change="(val, $e) => unlockMap(val, $e)"/>
                </c-form-control>
                <c-form-control>
                    <c-form-label html-for="auto_play">Autoplay videos</c-form-label>
                    <c-switch id="auto_play" :is-checked="session.auto_play" @change="(val, $e) => autoPlay(val, $e)"/>
                </c-form-control>
                <c-form-control max-w="320px">
                    <c-form-label html-for="video">Video to display</c-form-label>
                    <c-select 
                        id="video" 
                        v-model="session.screen_url"
                        placeholder="Select video"
                        variant="filled"
                        @change="(val) => selectVideo(session.screen_url)">
                        <option 
                            v-for="video in videos" 
                            v-bind:key="video.value" 
                            :value="video.value">
                            {{ video.name }}
                        </option>
                    </c-select>
                </c-form-control>
            </c-box>
        </c-grid>
        <c-box v-if="session.id" py="8" borderTop="1px solid #ccc">
            <c-heading as="h2" size="lg" mb="2" textTransform="uppercase">
                Team Stages
            </c-heading>
            <c-text>
                Select the current stage for each of the four teams in the Training Complex and in the Control Room.
            </c-text>
            <c-grid w="100%" template-columns="repeat(4, 1fr)" gap="10" mt="8">
                <c-box w="100%" v-for="team in session.teams" v-bind:key="team.team_name">
                    <c-heading as="h3" size="md" mb="4">
                        {{ team.team_name }}
                    </c-heading>

                    <c-form-control mb="4">
                        <c-form-label for="training-stage" fontWeight="600">Training stage</c-form-label>
                        <c-select 
                            id="training-stage" 
                            v-model="team.training_stage" 
                            placeholder="Select training stage" 
                            variant="filled"
                            @change="(val) => updateTrainingStage(team.team_name, val)">
                            <option 
                                v-for="stage in training_stages" 
                                v-bind:key="stage.value" 
                                :value="stage.value">
                                {{ stage.name }}
                            </option>
                        </c-select>
                    </c-form-control>
                    <c-form-control mb="4">
                        <c-form-label for="control-stage" fontWeight="600">Control Room stage</c-form-label>
                        <c-select 
                            id="control-stage"
                            v-model="team.control_stage"
                            placeholder="Select control room stage"
                            variant="filled"
                            @change="(val) => updateControlStage(team.team_name, val)">
                            <option 
                                v-for="stage in control_stages"
                                v-bind:key="stage.value"
                                :value="stage.value">
                                {{ stage.name }}
                            </option>
                        </c-select>
                    </c-form-control>
                </c-box>
            </c-grid>
        </c-box>
    </div>
</template>
<script>
import { getFirestore, collection, doc, addDoc, getDocs, setDoc, onSnapshot, query, where } from "firebase/firestore"; 
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            db: null,
            userSessions: null, 
            sessions: [],
            session: {},
            teams: [
                { name:'Team1' },
                { name: 'Team2'},
                { name: 'Team3'},
                { name: 'Team4'}
            ],
            training_stages: [
                { name: 'Debris', value: 'Debris' },
                { name: 'Learn to Drive', value: 'Learn to Drive' },
                { name: 'Curb Following', value: 'Curb Following' }, 
                { name: 'Remote Drones', value: 'Remote Drones' },
                { name: 'Drone Delivery', value: 'Drone Delivery' },
                { name: 'Drone Loops', value: 'Drone Loops' },
                { name: 'ScavengerHunt', value: 'ScavengerHunt' }
            ],
            control_stages: [
                { name: 'Preparation', value: 'Preparation' },
                { name: 'Response1', value: 'Response1' },
                { name: 'Response2', value: 'Response2' },
                { name: 'Response3', value: 'Response3' },
                { name: 'Ending', value: 'Ending' }
            ],
            videos: [
                { 
                    name: 'GaleForce Splash Screen',
                    value: 'https://galeforce.netlify.app/GaleForceSplash.html'
                },
                { 
                    name: 'GaleForce Promo video',
                    value: 'https://www.youtube.com/embed/sWlOTpK_ELo/'
                },
                { 
                    name: 'Hurricane Katrina Narrative (5 min)',
                    value: 'https://www.youtube.com/embed/eR84HlLcuc4'
                },
                {
                    name: 'Gale Force 2021 - 16 Years Later Video (2 min)',
                    value: 'https://www.youtube.com/embed/5mYE-x8p5gg'
                },
                {
                    name: 'Robots in the World Video (2:40)',
                    value: 'https://www.youtube.com/embed/fgMlOqeqlA0'
                },
                {
                    name: 'Intro to Co-robotics Slides',
                    value: 'https://docs.google.com/presentation/d/1X3M6qx0KqqgnSaQ1v3PaG0CwiZzcgz-SDP5hPvhwlBY/present#slide=id.gb49213746e_0_310'
                },
                {
                    name: 'Debris Removal - Hurricane Winds and Debris Video (2 min)',
                    value: 'https://www.youtube.com/embed/SP5v4exFuJo'
                },
                {
                    name: 'Intro to Machine Learning Slides',
                    value: 'https://docs.google.com/presentation/d/1pCITlQeTgiM8Sq55PfWzejOVTmkfV4lpNINuo2YYXzs/present'
                },
                {
                    name: 'Train Robots to have Computer Vision',
                    value: 'https://cv-recognize-objects.glitch.me/'
                },
                {
                    name: 'Drone Delivery Video (1 min)',
                    value: 'https://www.youtube.com/embed/LIC5Ppba4KQ'
                },
                {
                    name: 'Boston Dynamics Robots Dancing to Do you love me',
                    value: 'https://www.youtube.com/embed/fn3KWM1kuAw'
                },
                {
                    name: 'Coding with Drones Slides',
                    value: 'https://docs.google.com/presentation/d/1oJH_6f7nPxcP1AJB90SIq6R0qg3ifpWYiTZDjBYOpPw/present'
                },
                {
                    name: 'Session 5: prepare for storm in 2 days',
                    value: 'https://www.youtube.com/embed/KggihHftAlY'
                },
                {
                    name: 'Session 6: 1 day before',
                    value: 'https://www.youtube.com/embed/_u9Evqvxbrg'
                },
                {
                    name: 'Hurricane has hit! (2 min)',
                    value: 'https://youtube.com/embed/iMblDEoCxEs'
                },
                {
                    name: 'Session 7',
                    value: 'https://www.youtube.com/embed/2HotGTdtpYo'
                },
                {
                    name: 'Session 8',
                    value: 'https://www.youtube.com/embed/FIkYsmRmRbw'
                },
                {
                    name: 'Thank you from Dr. Jackson',
                    value: 'https://www.youtube.com/embed/tVrgaF8tj3A'
                },
                {
                    name: 'Happy - on youtube',
                    value: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs'
                },
                {
                    name: 'Chaka Khan - Like Sugar on youtube with ads',
                    value: 'https://www.youtube.com/watch?v=RecY5iZn6B0'
                },
                {
                    name: 'Good feeling',
                    value: 'https://www.youtube.com/watch?v=3OnnDqH6Wj8'
                },
                {
                    name: 'Taio Cruz - Dynamite',
                    value: 'https://www.youtube.com/watch?v=kJNyjdpT1vo'
                },
                {
                    name: 'I\'m just a girl',
                    value: 'https://www.youtube.com/watch?v=PHzOOQfhPFg&list=PL2-xNSWcVzEdwezFztJ4bxUEP5NP6cTB1&index='
                }
            ]
        }
    },
    async created() {
        this.db = getFirestore()
        
        this.userSessions = await collection(this.db, 'users/' + this.user.uid + '/sessions')
        const unsubscribe = onSnapshot(this.userSessions, (snapshot) => {
            this.sessions = []
            snapshot.forEach( (doc) => {
                const session = {
                    code: doc.data().code,
                    secret: doc.data().secret
                } 
                this.sessions.push(session)
            })
        })
    },
    computed: { 
        ...mapGetters(['user']),
    },
    methods: {
        newSession() {
            fetch('https://us-central1-savedblocks.cloudfunctions.net/galeforce/createsession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(response => response.json())
            .then( data => {
                const newSession = {
                    code: data.session_code,
                    secret: data.session_secret
                }
                addDoc(this.userSessions, newSession)
            })
        },
        async selectSession(code) {
            const sessionsRef = collection(this.db, 'sessions');
            const querySnapshot = await getDocs(query(sessionsRef, where('session_code', '==', code)))
            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
                this.session = doc.data()
                this.session.id = doc.id 
            });
        },
        autoPlay(val, $e) {
            this.session.auto_play = $e.target.checked
            this.updateSession()
        },
        mutePlayers(val, $e) {
            this.session.mute = $e.target.checked
            this.updateSession()
        },
        unlockMap(val, $e) {
            this.session.unlock_map = $e.target.checked
            this.updateSession()
        },
        selectVideo(url) {
            this.session.screen_url = url
            this.updateSession()
        },
        updateTrainingStage(team_name, stage) {
            this.session.teams = this.session.teams.map( team => {
                if (team.team_name == team_name) {
                    team.training_stage = stage
                }
                return team
            })
            this.updateSession()
        },
        updateControlStage(team_name, stage) {
            this.session.teams = this.session.teams.map( team => {
                if (team.team_name == team_name) {
                    team.control_stage = stage
                }
                return team
            })
            this.updateSession()
        },
        async updateSession() {
            await setDoc(doc(this.db, "sessions", this.session.id), this.session, { merge: true })
        }
    }
}
</script>
<style>
    button {
        background-color: #98338b !important;
        color: #ffffff;
    }
    input[type="checkbox"]:checked + .css-14ay6c5-className, input[type="checkbox"][aria-checked="mixed"]  + .css-14ay6c5-className{
        background-color: #0d75b5 !important;
    }
</style>