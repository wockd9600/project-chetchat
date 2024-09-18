"use strict";

class PublicController {
    /* GET */
    async initPublicRoom(req, res) {}

    async getMessageInPublicRoom(req, res) {}

    async getBlockWorlds(req, res) {}

    async getVisitAndQuestionCount(req, res) {}

    /* INSERT */
    async sendMessage(req, res) {}

    async sendMessageOfImageType(req, res) {}

    async addBlockWorlds(req, res) {}

    /* UPDATE */
    async updatePublicRommSettings(req, res) {}

    /* DELETE */
    async deleteMessage(req, res) {}

    async deleteMessageAll(req, res) {}

    async deleteBlockWorlds(req, res) {}
}

export default PublicController;
