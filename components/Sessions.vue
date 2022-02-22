<template>
    <div>
        <c-grid w="100%" template-columns="repeat(2, 1fr)" gap="10" mt="4" py="8">
            <c-box w="100%">
                <c-heading as="h2" size="lg" mb="2" textTransform="uppercase">
                    Session
                </c-heading>
                <c-form-control v-if="sessions.length > 0" d="flex">
                    <c-select 
                        id="active-session" 
                        v-model="session.session_code"
                        placeholder="Select session"
                        variant="filled"
                        @change="(val) => selectSession(val)"
                        max-width="240px">
                        <option 
                            v-for="session in sessions" 
                            v-bind:key="session.code" 
                            :value="session.code">
                            {{ session.code }}
                        </option>
                    </c-select>
                    <c-tooltip v-if="session.id" has-arrow label="Copy to clipboard" placement="right">
                        <c-icon-button id="copy" @click="copySession()" aria-label="Copy session code" icon="copy" ml="2"/>
                    </c-tooltip>
                </c-form-control>
                <c-text v-if="session.session_code">
                    Share this code with the players in your group.
                </c-text>
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
                        @change="(val) => this.selected_video = val">
                        <option 
                            v-for="video in videos" 
                            v-bind:key="video.value" 
                            :value="video.value">
                            {{ video.name }}
                        </option>
                    </c-select>
                </c-form-control>
                <c-tooltip has-arrow label="Play video in game" placement="left">
                    <c-button id="videoInGame" @click="playVideoInGame()" aria-label="Play video in game" mt="2" class="secondary">
                        <i class="fa fa-video"></i>
                    </c-button>
                </c-tooltip>
                <c-tooltip has-arrow label="Open video in browser" placement="right">
                    <c-button id="videoInBrowser" @click="openVideoInBrowser()" aria-label="Open video in browser" ml="2" mt="2" class="secondary">
                        <i class="fas fa-external-link-alt"></i>
                    </c-button>
                </c-tooltip>
                <c-form-control mt="4">
                    <c-button @click="openConfirmModal('all')">
                        Clear All Missions
                    </c-button>
                </c-form-control>
            </c-box>
        </c-grid>
        <c-box v-if="session.id" py="8" borderTop="1px solid #ccc">
            <c-grid w="100%" template-columns="repeat(2, 1fr)" gap="10" mt="4" py="8">
                <c-box w="100%">
                    <c-heading as="h2" size="lg" mb="2" textTransform="uppercase">
                        Team Stages
                    </c-heading>
                    <c-text>
                        Select the current stage for each of the four teams in the Training Complex and in the Control Room.
                    </c-text>
                </c-box>
                <c-box w="100%">
                    <c-heading as="h3" size="md" mb="4">
                        All Teams
                    </c-heading>

                    <c-form-control mb="4">
                        <c-form-label for="training-stage" fontWeight="600">Training stage</c-form-label>
                        <c-box d="flex">
                            <c-select 
                                id="training-stage"
                                v-model="selected_training_stage"
                                placeholder="Select training stage" 
                                variant="filled">
                                <option 
                                    v-for="stage in training_stages" 
                                    v-bind:key="stage.value" 
                                    :value="stage.value">
                                    {{ stage.name }}
                                </option>
                            </c-select>
                            <c-icon-button aria-label="Set stage" icon="arrow-forward" @click="updateTrainingStage('all', selected_training_stage)"/> 
                        </c-box>
                    </c-form-control>
                    <c-form-control mb="4">
                        <c-form-label for="control-stage" fontWeight="600">Control Room stage</c-form-label>
                        <c-box d="flex">
                            <c-select 
                                id="control-stage"
                                v-model="selected_control_stage"
                                placeholder="Select control room stage"
                                variant="filled">
                                <option 
                                    v-for="stage in control_stages"
                                    v-bind:key="stage.value"
                                    :value="stage.value">
                                    {{ stage.name }}
                                </option>
                            </c-select>
                            <c-icon-button aria-label="Set stage" icon="arrow-forward" @click="updateControlStage('all', selected_control_stage)"/>
                        </c-box>
                    </c-form-control>
                </c-box>
            </c-grid>
            <c-grid w="100%" template-columns="repeat(4, 1fr)" gap="10" mt="8">
                <c-box w="100%" v-for="team in session.teams" v-bind:key="team.team_name">
                    <c-heading as="h3" size="md" mb="4">
                        {{ team.team_name }}
                    </c-heading>

                    <c-form-control mb="4">
                        <c-form-label for="training-stage" fontWeight="600">Training stage</c-form-label>
                        <c-box d="flex">
                            <c-select 
                                id="training-stage" 
                                v-model="team.training_stage" 
                                placeholder="Select training stage" 
                                variant="filled">
                                <option 
                                    v-for="stage in training_stages" 
                                    v-bind:key="stage.value" 
                                    :value="stage.value">
                                    {{ stage.name }}
                                </option>
                            </c-select>
                            <c-icon-button aria-label="Set stage" icon="arrow-forward" @click="updateTrainingStage(team.team_name, team.training_stage)"/>
                        </c-box>
                    </c-form-control>
                    <c-form-control mb="4">
                        <c-form-label for="control-stage" fontWeight="600">Control Room stage</c-form-label>
                        <c-box d="flex">
                            <c-select 
                                id="control-stage"
                                v-model="team.control_stage"
                                placeholder="Select control room stage"
                                variant="filled">
                                <option 
                                    v-for="stage in control_stages"
                                    v-bind:key="stage.value"
                                    :value="stage.value">
                                    {{ stage.name }}
                                </option>
                            </c-select>
                            <c-icon-button aria-label="Set stage" icon="arrow-forward" @click="updateControlStage(team.team_name, team.control_stage)"/>
                        </c-box>
                    </c-form-control>

                    <c-box v-if="team.completed_missions.length > 0">
                        <c-form-control mb="4">
                            <c-form-label for="training-stage" fontWeight="600">
                                Completed Missions
                            </c-form-label>
                            <c-box>
                                <c-button v-for="mission in team.completed_missions" :key="`${team.team_name}-${mission}`" class="completed-mission">
                                    {{ mission }} <c-close-button @click="uncompleteMission(team.team_name, mission)" size="sm" />
                                </c-button>
                            </c-box>
                        </c-form-control>
                        <c-form-control>
                            <c-button @click="openConfirmModal(team.team_name)">
                                Clear Missions
                            </c-button>
                        </c-form-control>
                    </c-box>
                    <c-box v-else>
                        No missions completed yet
                    </c-box>
                </c-box>
            </c-grid>
        </c-box>
        <c-modal
            :is-open="isOpen"
            :on-close="closeConfirmModal"
            >
            <c-modal-content ref="content">
                <c-modal-header>Are you sure?</c-modal-header>
                <c-modal-close-button />
                <c-modal-body>
                    <c-text>
                        Clear completed missions for {{ teamToClear }}
                        <template v-if="teamToClear == 'all'">teams</template>
                    </c-text>
                </c-modal-body>
                <c-modal-footer>
                    <c-button @click="confimClear" mr="3">
                        Yes
                    </c-button>
                    <c-button @click="closeConfirmModal" class="secondary">Cancel</c-button>
                </c-modal-footer>
            </c-modal-content>
            <c-modal-overlay />
        </c-modal>
    </div>
</template>
<script>
import { getFirestore, collection, doc, addDoc, setDoc, onSnapshot, query, where } from "firebase/firestore";
import { getDatabase, ref, remove, set } from "firebase/database" 
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            db: null,
            rtdb: null,
            userSessions: null, 
            sessions: [],
            session: {},
            teams: [
                { name: 'Team1' },
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
            selected_training_stage: '',
            selected_control_stage: '',
            selected_video: '',
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
            ],
            isOpen: false,
            teamToClear: ''
        }
    },
    async created() {
        this.db = getFirestore()
        this.rtdb = getDatabase()
        
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
                this.selectSession(newSession.code)
                this.sessions.push(newSession)
            })
        },
        async selectSession(code) {
            const sessionsRef = collection(this.db, 'sessions');
            onSnapshot(query(sessionsRef, where('session_code', '==', code)), 
                querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        this.session = doc.data()
                        this.session.id = doc.id
                    });
                }
            );
        },
        autoPlay(val, $e) {
            this.session.auto_play = $e.target.checked
            const title = (this.session.auto_play) ? 'Autoplay Enabled' : 'Autoplay Disabled'
            this.updateSession(title)
        },
        mutePlayers(val, $e) {
            this.session.mute = $e.target.checked
            const title = (this.session.mute) ? 'Players Muted' : 'Players Unmuted'
            this.updateSession(title)
        },
        unlockMap(val, $e) {
            this.session.unlock_map = $e.target.checked
            const title = (this.session.unlock_map) ? 'Map Unlocked' : 'Map Locked'
            this.updateSession(title)
        },
        playVideoInGame() {
            this.session.screen_url = this.selected_video
            this.updateSession('Video Started')
        },
        openVideoInBrowser() {
            window.open(this.selected_video, '_blank');
        },
        updateTrainingStage(team_name, stage) {
            this.session.teams = this.session.teams.map( team => {
                if (team.team_name == team_name || team_name == 'all') {
                    team.training_stage = stage
                }
                return team
            })
            const title = 'Stage updated'
            const description = `Stage set to ${stage} for ${team_name}`
            this.updateSession(title, description)
        },
        updateControlStage(team_name, stage) {
            this.session.teams = this.session.teams.map( team => {
                if (team.team_name == team_name || team_name == 'all') {
                    team.control_stage = stage
                }
                return team
            })
            const title = 'Stage updated'
            const description = `Stage set to ${stage} for ${team_name}`
            this.updateSession(title, description)
        },
        uncompleteMission(team_name, mission) {
            this.session.teams = this.session.teams.map( team => {
                if (team.team_name == team_name || team_name == 'all') {
                    team.completed_missions = team.completed_missions.filter(
                        m => m !== mission 
                    )
                }
                return team
            })
            const title = 'Mission Cleared'
            const description = `Mission ${mission} cleared for ${team_name}`
            this.updateSession(title, description)
            // Clear saved code from Firebase RTDB
            remove(ref(this.rtdb, `${this.session.session_code}/teams/${team_name}/${mission}`))
        },
        clearMissions(team_name) {
            this.session.teams = this.session.teams.map( team => {
                if (team.team_name == team_name || team_name == 'all') {
                    team.completed_missions = []
                }
                return team
            })
            const title = 'Missions Cleared'
            let description = 'Missions were cleared for '
            if (team_name == 'all') {
                description += 'all teams'
            } else {
                description += team_name
            }
            this.updateSession(title, description)
            // Clear saved code from Firebase RTDB
            if (team_name == 'all') {
                remove(ref(this.rtdb, `${this.session.session_code}/teams`))
            } else {
                remove(ref(this.rtdb, `${this.session.session_code}/teams/${team_name}`))
            }
            this.prepopulateMissionCode(team_name)
        },
        async updateSession(title, description, status='info') {
            await setDoc(doc(this.db, "sessions", this.session.id), this.session, { merge: true })
            this.showToast(title, description, status)
        },
        copySession() {
            const text = this.session.session_code
            navigator.clipboard
            .writeText(text)
            .then(() => {
                console.log(`"${text}" was copied to clipboard.`);
            })
            .catch((err) => {
                console.error(`Error copying text to clipboard: ${err}`);
            });
        },
        openConfirmModal(team) {
            this.teamToClear = team
            this.isOpen = true
        },
        confimClear() {
            this.isOpen = false
            this.clearMissions(this.teamToClear)
        },
        closeConfirmModal() {
            this.isOpen = false
        },
        showToast(title, description = '', status = 'info') {
            this.$toast({
                title,
                description,
                status,
                isClosable: false,
                duration: 5000
            })
        },
        prepopulateMissionCode(team_name) {
            const savedCode = [
                {
                    id: '17a',
                    blocks: '<xml xmlns=\"http://www.w3.org/1999/xhtml\">\n  <variables>\n    <variable type=\"\" id=\"vcS-CS$2Wg6ihAn#p4!-\" islocal=\"false\">distance</variable>\n  </variables>\n  <block type=\"event_whenflagclicked\" id=\"W[8Nl[70ttY=$3$7Rax9\" x=\"-242\" y=\"-413\"></block>\n  <block type=\"drone_fly\" id=\"/{}Zo={OBxAGoISI.V2x\" disabled=\"true\" x=\"-257\" y=\"-316\">\n    <field name=\"DIRECTION\">forward</field>\n    <value name=\"DISTANCE\">\n      <shadow type=\"math_number\" id=\"^wbWv*g-s[%)3r91|#tP\">\n        <field name=\"NUM\">1</field>\n      </shadow>\n    </value>\n  </block>\n  <block type=\"motion_turn_right_left\" id=\"Oi^Q-PQqD`8TslR/iHQD\" disabled=\"true\" x=\"-129\" y=\"-241\">\n    <field name=\"DIRECTION\">right</field>\n  </block>\n  <block type=\"control_repeat\" id=\"mgN^n3nW..ey-uA$h$:N\" disabled=\"true\" x=\"-266\" y=\"-164\">\n    <value name=\"TIMES\">\n      <shadow type=\"math_number\" id=\"$0Twhg/oM;.!-9Z_h^z;\">\n        <field name=\"NUM\">12</field>\n      </shadow>\n    </value>\n  </block>\n  <block type=\"data_variable\" id=\"(SrD4;tXeHZc#k_QkJgq\" disabled=\"true\" x=\"-83\" y=\"-125\">\n    <field name=\"VARIABLE\" id=\"vcS-CS$2Wg6ihAn#p4!-\" variabletype=\"\">distance</field>\n  </block>\n  <block type=\"data_setvariableto\" id=\"g#m5XD#t6%j=.n]D`%g,\" disabled=\"true\" x=\"-270\" y=\"-10\">\n    <field name=\"VARIABLE\" id=\"vcS-CS$2Wg6ihAn#p4!-\" variabletype=\"\">distance</field>\n    <value name=\"VALUE\">\n      <shadow type=\"text\" id=\"s|H2hg~?jH0tR_rA^0P7\">\n        <field name=\"TEXT\">0</field>\n      </shadow>\n    </value>\n  </block>\n  <block type=\"data_changevariableby\" id=\"w/b(4r:`Yn.na6vHW$p0\" disabled=\"true\" x=\"-279\" y=\"86\">\n    <field name=\"VARIABLE\" id=\"vcS-CS$2Wg6ihAn#p4!-\" variabletype=\"\">distance</field>\n    <value name=\"VALUE\">\n      <shadow type=\"math_number\" id=\"g)wpp=^_{bV%@Q3lNRL^\">\n        <field name=\"NUM\">1</field>\n      </shadow>\n    </value>\n  </block>\n</xml>'
                },
                {
                    id: '17b',
                    blocks: '<xml xmlns=\"http://www.w3.org/1999/xhtml\">\n  <variables>\n    <variable type=\"\" id=\"vcS-CS$2Wg6ihAn#p4!-\" islocal=\"false\">distance</variable>\n  </variables>\n  <block type=\"event_whenflagclicked\" id=\"W[8Nl[70ttY=$3$7Rax9\" x=\"-242\" y=\"-413\"></block>\n  <block type=\"drone_fly\" id=\"/{}Zo={OBxAGoISI.V2x\" disabled=\"true\" x=\"-257\" y=\"-316\">\n    <field name=\"DIRECTION\">forward</field>\n    <value name=\"DISTANCE\">\n      <shadow type=\"math_number\" id=\"^wbWv*g-s[%)3r91|#tP\">\n        <field name=\"NUM\">1</field>\n      </shadow>\n    </value>\n  </block>\n  <block type=\"motion_turn_right_left\" id=\"Oi^Q-PQqD`8TslR/iHQD\" disabled=\"true\" x=\"-129\" y=\"-241\">\n    <field name=\"DIRECTION\">left</field>\n  </block>\n  <block type=\"control_repeat\" id=\"mgN^n3nW..ey-uA$h$:N\" disabled=\"true\" x=\"-266\" y=\"-164\">\n    <value name=\"TIMES\">\n      <shadow type=\"math_number\" id=\"$0Twhg/oM;.!-9Z_h^z;\">\n        <field name=\"NUM\">12</field>\n      </shadow>\n    </value>\n  </block>\n  <block type=\"data_variable\" id=\"(SrD4;tXeHZc#k_QkJgq\" disabled=\"true\" x=\"-83\" y=\"-125\">\n    <field name=\"VARIABLE\" id=\"vcS-CS$2Wg6ihAn#p4!-\" variabletype=\"\">distance</field>\n  </block>\n  <block type=\"data_setvariableto\" id=\"g#m5XD#t6%j=.n]D`%g,\" disabled=\"true\" x=\"-270\" y=\"-10\">\n    <field name=\"VARIABLE\" id=\"vcS-CS$2Wg6ihAn#p4!-\" variabletype=\"\">distance</field>\n    <value name=\"VALUE\">\n      <shadow type=\"text\" id=\"s|H2hg~?jH0tR_rA^0P7\">\n        <field name=\"TEXT\">0</field>\n      </shadow>\n    </value>\n  </block>\n  <block type=\"data_changevariableby\" id=\"w/b(4r:`Yn.na6vHW$p0\" disabled=\"true\" x=\"-279\" y=\"86\">\n    <field name=\"VARIABLE\" id=\"vcS-CS$2Wg6ihAn#p4!-\" variabletype=\"\">distance</field>\n    <value name=\"VALUE\">\n      <shadow type=\"math_number\" id=\"g)wpp=^_{bV%@Q3lNRL^\">\n        <field name=\"NUM\">1</field>\n      </shadow>\n    </value>\n  </block>\n</xml>'
                }
            ]

            savedCode.map( saved => {
                if (team_name == 'all') {
                    // add code to missions for each team
                    this.session.teams.map( team => {
                        set(ref(this.rtdb, `${this.session.session_code}/teams/${team.team_name}/${saved.id}/`), {blocks: saved.blocks})
                    })
                } else {
                    set(ref(this.rtdb, `${this.session.session_code}/teams/${team_name}/${saved.id}/`), {blocks: saved.blocks})
                }
            })
        }
    }
}
</script>
<style>
    button {
        background-color: #98338b !important;
        color: #ffffff;
    }
    button.completed-mission {
        position: relative;
        background-color: transparent !important;
        color: #0d75b5 !important;
    }
    button.completed-mission:hover {
        background-color: #0d75b5 !important;
        color: #ffffff !important;
    }
    button.completed-mission button {
        position: absolute;
        top: -10px;
        right: -10px;
        display: none;
    }
    button.completed-mission:hover button {
        display: block;
    }
    button#copy, button.secondary {
        background-color: #59aade !important;
    }
    button:hover {
        opacity: 0.8;
    }
    input[type="checkbox"]:checked + div, input[type="checkbox"][aria-checked="mixed"] + div {
        background-color: #0d75b5 !important;
    }
</style>
