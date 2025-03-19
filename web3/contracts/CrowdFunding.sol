// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
contract CrowdFunding {
    // compaign that store these information
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        string category;
        string location;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;
    mapping(uint256 => uint256) public campaignLikes;
    mapping(uint256 => uint256) public campaignDislikes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => uint256[]) private userBookmarks;
    
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _category,
        string memory _location,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];
        // boundary condition
        require(
            campaign.deadline < block.timestamp,
            "The deadline should be a date in the future!"
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.category = _category;
        campaign.location = _location;
        campaign.amountCollected = 0;
        campaign.image = _image;
        // increse the campaigns
        numberOfCampaigns++;

        // return the id of campaign
        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        // insert in the donations array
        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        // sent the transactions
        (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        // check the transaction is completed or not
        if (sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }

    function likeCampaign(uint256 _campaignId) public {
        require(
            !hasVoted[_campaignId][msg.sender],
            "You have already voted for this campaign"
        );
        campaignLikes[_campaignId]++;
        hasVoted[_campaignId][msg.sender] = true; // Mark as voted
    }

    // Dislike a campaign
    function dislikeCampaign(uint256 _campaignId) public {
        require(
            !hasVoted[_campaignId][msg.sender],
            "You have already voted for this campaign"
        );
        campaignDislikes[_campaignId]++;
        hasVoted[_campaignId][msg.sender] = true; // Mark as voted
    }

    function getLikesAndDislikes(
        uint256 _campaignId
    ) public view returns (uint256 likes, uint256 dislikes) {
        likes = campaignLikes[_campaignId];
        dislikes = campaignDislikes[_campaignId];
    }

        // Add a campaign to user's bookmarks
    function bookmarkCampaign(uint256 _campaignId) public {
        require(_campaignId < numberOfCampaigns, "Campaign does not exist");

        // Check if already bookmarked
        uint256[] storage bookmarks = userBookmarks[msg.sender];
        for (uint i = 0; i < bookmarks.length; i++) {
            require(bookmarks[i] != _campaignId, "Campaign already bookmarked");
        }

        // Add to bookmarks
        bookmarks.push(_campaignId);
    }

    // Get user's bookmarked campaigns
    function getBookmarks() public view returns (uint256[] memory) {
        return userBookmarks[msg.sender];
    }
}
