
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title KAVACH - Decentralized Crime Reporting Platform
 * @dev Smart contract for a decentralized crime reporting system with privacy protection
 */
contract KavachReporting {
    // Define report status types
    enum ReportStatus { Pending, Investigating, Resolved }
    
    // Define crime categories
    enum CrimeCategory { Theft, Assault, Vandalism, Fraud, Harassment, Other }
    
    // Structure for location data
    struct Location {
        int256 latitude;  // Multiplied by 1e6 to store as integer
        int256 longitude; // Multiplied by 1e6 to store as integer
        string locationHash; // IPFS hash for more detailed location info
    }
    
    // Structure for evidence data
    struct Evidence {
        string evidenceType; // Type of evidence (image, video, document, audio)
        string ipfsHash;     // IPFS hash of the evidence
        string description;  // Description of the evidence
        uint256 timestamp;   // When the evidence was added
    }
    
    // Structure for a crime report
    struct Report {
        uint256 id;
        string titleHash; // IPFS hash of the report title
        string descriptionHash; // IPFS hash of the report description
        CrimeCategory category;
        Location location;
        uint256 timestamp;
        ReportStatus status;
        bytes32 reporterHash; // Hashed identifier of the reporter (phone number + salt)
        string witnessesHash; // IPFS hash for witnesses information
        string evidenceHash;  // IPFS hash for evidence information
        string detailsHash;   // IPFS hash for any additional report details
        uint8 urgencyLevel;   // 1-5 scale, 5 being most urgent
        bytes32 officerAssignedHash; // Hashed identifier of assigned officer (if any)
    }
    
    // Mapping from report ID to Report
    mapping(uint256 => Report) public reports;
    
    // Total number of reports
    uint256 public reportCount;
    
    // Mapping for districts to report counts
    mapping(string => uint256) public districtReportCounts;
    
    // Mapping for categories to report counts
    mapping(uint8 => uint256) public categoryReportCounts;
    
    // Event emitted when a new report is created
    event ReportCreated(uint256 indexed reportId, bytes32 indexed reporterHash, uint256 timestamp, CrimeCategory category);
    
    // Event emitted when a report's status is updated
    event ReportStatusUpdated(uint256 indexed reportId, ReportStatus status);
    
    // Event emitted when evidence is added to a report
    event EvidenceAdded(uint256 indexed reportId, string evidenceHash);
    
    // Event emitted when an officer is assigned to a report
    event OfficerAssigned(uint256 indexed reportId, bytes32 officerHash);
    
    // Authorized entities that can update report status (e.g., law enforcement)
    mapping(address => bool) public authorizedEntities;
    
    // Owner of the contract
    address public owner;
    
    constructor() {
        owner = msg.sender;
        authorizedEntities[msg.sender] = true;
    }
    
    // Modifier to restrict certain actions to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    // Modifier to restrict certain actions to authorized entities
    modifier onlyAuthorized() {
        require(authorizedEntities[msg.sender], "Caller is not authorized");
        _;
    }
    
    /**
     * @dev Add a new authorized entity
     * @param entity Address of the entity to authorize
     */
    function addAuthorizedEntity(address entity) external onlyOwner {
        authorizedEntities[entity] = true;
    }
    
    /**
     * @dev Remove an authorized entity
     * @param entity Address of the entity to deauthorize
     */
    function removeAuthorizedEntity(address entity) external onlyOwner {
        authorizedEntities[entity] = false;
    }
    
    /**
     * @dev Submit a new crime report
     * @param titleHash IPFS hash of the report title
     * @param descriptionHash IPFS hash of the report description
     * @param category Crime category
     * @param latitude Location latitude (multiplied by 1e6)
     * @param longitude Location longitude (multiplied by 1e6)
     * @param locationHash IPFS hash for more detailed location info
     * @param reporterHash Hashed identifier of the reporter
     * @param witnessesHash IPFS hash for witnesses information
     * @param evidenceHash IPFS hash for evidence information
     * @param detailsHash IPFS hash for any additional report details
     * @param urgencyLevel Urgency level (1-5)
     * @param districtId District identifier for statistics
     * @return reportId The ID of the newly created report
     */
    function submitReport(
        string memory titleHash,
        string memory descriptionHash,
        uint8 category,
        int256 latitude,
        int256 longitude,
        string memory locationHash,
        bytes32 reporterHash,
        string memory witnessesHash,
        string memory evidenceHash,
        string memory detailsHash,
        uint8 urgencyLevel,
        string memory districtId
    ) external returns (uint256 reportId) {
        require(category <= uint8(CrimeCategory.Other), "Invalid category");
        require(urgencyLevel >= 1 && urgencyLevel <= 5, "Urgency level must be between 1 and 5");
        
        reportCount++;
        reportId = reportCount;
        
        reports[reportId] = Report({
            id: reportId,
            titleHash: titleHash,
            descriptionHash: descriptionHash,
            category: CrimeCategory(category),
            location: Location({
                latitude: latitude,
                longitude: longitude,
                locationHash: locationHash
            }),
            timestamp: block.timestamp,
            status: ReportStatus.Pending,
            reporterHash: reporterHash,
            witnessesHash: witnessesHash,
            evidenceHash: evidenceHash,
            detailsHash: detailsHash,
            urgencyLevel: urgencyLevel,
            officerAssignedHash: bytes32(0)
        });
        
        // Update statistics
        categoryReportCounts[category]++;
        districtReportCounts[districtId]++;
        
        emit ReportCreated(reportId, reporterHash, block.timestamp, CrimeCategory(category));
        return reportId;
    }
    
    /**
     * @dev Update the status of a report
     * @param reportId ID of the report to update
     * @param status New status to set
     */
    function updateReportStatus(uint256 reportId, ReportStatus status) external onlyAuthorized {
        require(reportId <= reportCount, "Report does not exist");
        
        Report storage report = reports[reportId];
        report.status = status;
        
        emit ReportStatusUpdated(reportId, status);
    }
    
    /**
     * @dev Assign an officer to a report
     * @param reportId ID of the report
     * @param officerHash Hashed identifier of the officer
     */
    function assignOfficer(uint256 reportId, bytes32 officerHash) external onlyAuthorized {
        require(reportId <= reportCount, "Report does not exist");
        
        Report storage report = reports[reportId];
        report.officerAssignedHash = officerHash;
        
        emit OfficerAssigned(reportId, officerHash);
    }
    
    /**
     * @dev Add evidence to an existing report
     * @param reportId ID of the report
     * @param evidenceHash IPFS hash containing the evidence data
     */
    function addEvidence(uint256 reportId, string memory evidenceHash) external {
        require(reportId <= reportCount, "Report does not exist");
        
        // In a production environment, we would verify that only the original reporter
        // or an authorized entity can add evidence
        
        reports[reportId].evidenceHash = evidenceHash;
        
        emit EvidenceAdded(reportId, evidenceHash);
    }
    
    /**
     * @dev Get report IDs by status
     * @param status Status to filter by
     * @param offset Starting index
     * @param limit Maximum number of reports to return
     * @return reportIds Array of report IDs with the specified status
     */
    function getReportsByStatus(
        ReportStatus status, 
        uint256 offset, 
        uint256 limit
    ) external view returns (uint256[] memory reportIds) {
        uint256 count = 0;
        
        // First, count how many reports match the status
        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].status == status) {
                count++;
            }
        }
        
        // Adjust limit if needed
        if (offset >= count) {
            return new uint256[](0);
        }
        
        uint256 resultSize = (offset + limit > count) ? (count - offset) : limit;
        reportIds = new uint256[](resultSize);
        
        uint256 resultIndex = 0;
        uint256 matchingCount = 0;
        
        // Fill the result array
        for (uint256 i = 1; i <= reportCount && resultIndex < resultSize; i++) {
            if (reports[i].status == status) {
                if (matchingCount >= offset) {
                    reportIds[resultIndex] = i;
                    resultIndex++;
                }
                matchingCount++;
            }
        }
        
        return reportIds;
    }
    
    /**
     * @dev Get reports by category
     * @param category Category to filter by
     * @param offset Starting index
     * @param limit Maximum number of reports to return
     * @return reportIds Array of report IDs with the specified category
     */
    function getReportsByCategory(
        CrimeCategory category,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory reportIds) {
        uint256 count = 0;
        
        // First, count how many reports match the category
        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].category == category) {
                count++;
            }
        }
        
        // Adjust limit if needed
        if (offset >= count) {
            return new uint256[](0);
        }
        
        uint256 resultSize = (offset + limit > count) ? (count - offset) : limit;
        reportIds = new uint256[](resultSize);
        
        uint256 resultIndex = 0;
        uint256 matchingCount = 0;
        
        // Fill the result array
        for (uint256 i = 1; i <= reportCount && resultIndex < resultSize; i++) {
            if (reports[i].category == category) {
                if (matchingCount >= offset) {
                    reportIds[resultIndex] = i;
                    resultIndex++;
                }
                matchingCount++;
            }
        }
        
        return reportIds;
    }
    
    /**
     * @dev Get reports by reporter hash
     * @param reporterHash Hash of the reporter's identifier
     * @param offset Starting index
     * @param limit Maximum number of reports to return
     * @return reportIds Array of report IDs submitted by the specified reporter
     */
    function getReportsByReporter(
        bytes32 reporterHash,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory reportIds) {
        uint256 count = 0;
        
        // First, count how many reports match the reporter
        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].reporterHash == reporterHash) {
                count++;
            }
        }
        
        // Adjust limit if needed
        if (offset >= count) {
            return new uint256[](0);
        }
        
        uint256 resultSize = (offset + limit > count) ? (count - offset) : limit;
        reportIds = new uint256[](resultSize);
        
        uint256 resultIndex = 0;
        uint256 matchingCount = 0;
        
        // Fill the result array
        for (uint256 i = 1; i <= reportCount && resultIndex < resultSize; i++) {
            if (reports[i].reporterHash == reporterHash) {
                if (matchingCount >= offset) {
                    reportIds[resultIndex] = i;
                    resultIndex++;
                }
                matchingCount++;
            }
        }
        
        return reportIds;
    }
    
    /**
     * @dev Get the details of a specific report
     * @param reportId ID of the report to retrieve
     * @return Report details
     */
    function getReport(uint256 reportId) external view returns (
        string memory titleHash,
        string memory descriptionHash,
        CrimeCategory category,
        int256 latitude,
        int256 longitude,
        string memory locationHash,
        uint256 timestamp,
        ReportStatus status,
        bytes32 reporterHash,
        string memory witnessesHash,
        string memory evidenceHash,
        string memory detailsHash,
        uint8 urgencyLevel,
        bytes32 officerAssignedHash
    ) {
        require(reportId <= reportCount, "Report does not exist");
        
        Report storage report = reports[reportId];
        
        return (
            report.titleHash,
            report.descriptionHash,
            report.category,
            report.location.latitude,
            report.location.longitude,
            report.location.locationHash,
            report.timestamp,
            report.status,
            report.reporterHash,
            report.witnessesHash,
            report.evidenceHash,
            report.detailsHash,
            report.urgencyLevel,
            report.officerAssignedHash
        );
    }
    
    /**
     * @dev Get statistics for reports
     * @return totalReports Total number of reports
     * @return pendingReports Number of pending reports
     * @return investigatingReports Number of reports under investigation
     * @return resolvedReports Number of resolved reports
     */
    function getReportStatistics() external view returns (
        uint256 totalReports,
        uint256 pendingReports,
        uint256 investigatingReports,
        uint256 resolvedReports
    ) {
        totalReports = reportCount;
        
        for (uint256 i = 1; i <= reportCount; i++) {
            if (reports[i].status == ReportStatus.Pending) {
                pendingReports++;
            } else if (reports[i].status == ReportStatus.Investigating) {
                investigatingReports++;
            } else if (reports[i].status == ReportStatus.Resolved) {
                resolvedReports++;
            }
        }
        
        return (totalReports, pendingReports, investigatingReports, resolvedReports);
    }
}
